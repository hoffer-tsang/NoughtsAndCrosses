/*==============================================================================
 *
 * DbInitializer to create default data in database
 *
 * Copyright © Dorset Software Training, 2023
 *
 * TSD Section: Noughts and Crosses
 *
 *============================================================================*/

using BusinessLayer;
using Models.EntityFrameWork;

namespace EntityFrameWorkModel.Data
{
    /// <summary>
    /// Contain detail to initialize data in database with user login
    /// </summary>
    public class DbInitializer
    {

        /// <summary>
        /// The initialize function to popuplate all database default value
        /// </summary>
        /// <param name="context"> the context of entity framework</param>
        public static void Initialize(UserContext context)
        {
            context.Database.EnsureCreated();

            if (context.UserLogins.Any())
            {
                return;
            }
            
            var userLogins = new UserLogin[]
            {
                new UserLogin {UserName = "Hoffer", Email = "hoffer.tsang@dorsetsoftware.co.uk"},
                new UserLogin {UserName = "Tom", Email = "tom.sparham@dorsetsoftware.co.uk"},
                new UserLogin {UserName = "PJ", Email = "phill.boardley@dorsetsoftware.co.uk"}
            };
            var passwordHashing = new PasswordHashing();
            foreach (var user in userLogins)
            {
                var password = passwordHashing.SHA256Hash("qwer7890");
                user.HashedPassword = password[0];
                user.Salt = password[1];
                context.UserLogins.Add(user);
            }
            context.SaveChanges();
        }
    }
}
