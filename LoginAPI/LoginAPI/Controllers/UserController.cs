/*==============================================================================
 *
 * User Controller contain crud method for user login 
 *
 * Copyright © Dorset Software Training, 2023
 *
 * TSD Section: Noughts and Crosses
 *
 *============================================================================*/
using EntityFrameWorkModel.Data;
using Microsoft.AspNetCore.Mvc;
using BusinessLayer;
using System.Text.RegularExpressions;
using Models.API;
using Models.EntityFrameWork;
using Microsoft.AspNetCore.Cors;

namespace LoginAPI.Controllers
{
    /// <summary>
    /// User Controller with crud method
    /// </summary>
    [ApiController]
    [Route("api/v1/User")]
    [EnableCors("AllowAllHeaders")]
    public class UserController : Controller
    {
        private readonly UserContext _Context;
        private PasswordHashing _PasswordHashing;

        /// <summary>
        /// User Controlelr constructor for context and password hashing class
        /// </summary>
        /// <param name="context"></param>
        public UserController(UserContext context)
        {
            _Context = context;
            _PasswordHashing = new PasswordHashing();
        }

        /// <summary>
        /// Login Check
        /// </summary>
        /// <param name="usernameOrEmail"> username or email to login </param>
        /// <param name="password"> password to login </param>
        /// <returns> true if login success </returns>
        [HttpGet]
        public ActionResult Login(string usernameOrEmail, string password)
        {
            
            var response = _Context.UserLogins.Where(u => u.Email == usernameOrEmail || u.UserName == usernameOrEmail).SingleOrDefault();
            if (response == null)
            {
                return NotFound();
            }
            var hashedPassword = _PasswordHashing.SHA256HashWithSalt(password, response.Salt!);
            if (response.HashedPassword != hashedPassword)
            {
                return NotFound();
            }
            return Ok(UserConvert(response));
        }

        /// <summary>
        /// Update password when forgotten password
        /// </summary>
        /// <param name="forgottenPassword"> new password with username and rowversion </param>
        /// <returns> user id if successful, or else other error depend on specific error </returns>
        [HttpPut]
        public ActionResult UpdatePassword(ForgettenPassword forgottenPassword)
        {
            var password = forgottenPassword.Password!;
            if (password.Length < 12 || !IsAllPresent(password))
            {
                return UnprocessableEntity(); //"Password has to be longer then 12 characters, including Capital, letter, number and special character.";
            }
            var user = _Context.UserLogins.Where(u => u.Email == forgottenPassword.Email).SingleOrDefault();
            if (user == null)
            {
                return NotFound();
            }
            if (!user.RowVersion!.SequenceEqual(forgottenPassword.RowVersion!))
            {
                return Conflict();
            }
            var hashedPassword = _PasswordHashing.SHA256Hash(password);
            user.HashedPassword = hashedPassword[0];
            user.Salt = hashedPassword[1];
            _Context.SaveChanges();
            return Ok(user.Id);
        }

        /// <summary>
        /// Add New User 
        /// </summary>
        /// <param name="newUser">username, email, and password </param>
        /// <returns> the user Id </returns>
        [HttpPost]
        public ActionResult NewUser(NewUser newUser)
        {
            var password = newUser.Password!;
            if (password.Length < 12 || !IsAllPresent(password))
            {
                return UnprocessableEntity(); //"Password has to be longer then 12 characters, including Capital, letter, number and special character.";
            }
            var hashedPassword = _PasswordHashing.SHA256Hash(password);
            var user = new UserLogin
            {
                UserName = newUser.UserName,
                Email = newUser.Email,
                HashedPassword = hashedPassword[0],
                Salt = hashedPassword[1]
            };
            _Context.UserLogins.Add(user);
            try
            {
                _Context.SaveChanges();
            } catch (Exception)
            {
                return Conflict();
            }
            return Ok(user.Id);
        }

        /// <summary>
        /// Get Details of a specific user with username
        /// </summary>
        /// <param name="email"> email of the user </param>
        /// <returns> user details without salt and password </returns>
        [HttpGet]
        [Route("Details")]
        public ActionResult GetDetails(string email)
        {
            var response = _Context.UserLogins.Where(u => u.Email == email).SingleOrDefault();
            if (response == null)
            {
                return NotFound();
            }
            return Ok(UserConvert(response));
        }

        /// <summary>
        /// Check new password format
        /// </summary>
        /// <param name="str"> password </param>
        /// <returns> true if match regex format </returns>
        private bool IsAllPresent(string str)
        {
            string regex = "^(?=.*[a-z])(?=."
                        + "*[A-Z])(?=.*\\d)"
                        + "(?=.*[-+_!@#$%^&*., ?]).+$";

            Regex p = new Regex(regex);

            if (str == null)
            {
                return false;
            }
            Match m = p.Match(str);

            // Print Yes if string
            // matches ReGex
            if (m.Success)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
      
        private UserDetails UserConvert(UserLogin data)
        {
            return new UserDetails
            {
                Id = data.Id,
                UserName = data.UserName,
                Email = data.Email,
                RowVersion = data.RowVersion
            };
        }
    }
}
