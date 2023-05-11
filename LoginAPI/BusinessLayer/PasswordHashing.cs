/*==============================================================================
 *
 * Password Business Logic
 *
 * Copyright © Dorset Software Training, 2023
 *
 * TSD Section: Noughts and Crosses
 *
 *============================================================================*/
using System.Security.Cryptography;
using System.Text;

namespace BusinessLayer
{
    /// <summary>
    /// Contain logic to hash password with salt or without salt
    /// </summary>
    public class PasswordHashing
    {
        private string _Pepper = "testing123";
        /// <summary>
        /// Generate hash password and new random salt
        /// </summary>
        /// <param name="password"> password enter </param>
        /// <returns> first term is the hashed password, second term is the salt </returns>
        public List<string> SHA256Hash(string password)
        {
            string salt = CreateSalt(10);
            string hashedPassword = GenerateSHA256Hash(password, salt);
            return new List<string>()
            {
                hashedPassword, salt
            };
        }

        /// <summary>
        /// Generate hash password with specific salt
        /// </summary>
        /// <param name="password"> password </param>
        /// <param name="salt"> salt </param>
        /// <returns> the hashed password </returns>
        public string SHA256HashWithSalt(string password, string salt)
        {
            string hashedPassword = GenerateSHA256Hash(password, salt);
            return hashedPassword;
        }

        /// <summary>
        /// Create a random salt
        /// </summary>
        /// <param name="size"> size of byte to generate </param>
        /// <returns> a string of salt </returns>
        private string CreateSalt(int size)
        {
            var buffer = RandomNumberGenerator.GetBytes(size);
            return Convert.ToBase64String(buffer);
        }

        /// <summary>
        /// hashed the password with salt
        /// </summary>
        /// <param name="password"> password </param>
        /// <param name="salt"> salt </param>
        /// <returns> hashed password in string format </returns>
        private string GenerateSHA256Hash(string password, string salt)
        {
            byte[] bytes = System.Text.Encoding.UTF8.GetBytes(password + salt + _Pepper);
#pragma warning disable SYSLIB0045 // Type or member is obsolete
            var algo = HashAlgorithm.Create(nameof(SHA256));
#pragma warning restore SYSLIB0045 // Type or member is obsolete
            var hashPassword = algo!.ComputeHash(bytes);
            return ByteArrayToHexString(hashPassword); 
        }

        /// <summary>
        /// convert bytes to string
        /// </summary>
        /// <param name="bytes"></param>
        /// <returns></returns>
        private string ByteArrayToHexString(byte[] bytes)
        {
            StringBuilder hex = new StringBuilder(bytes.Length * 2);
            foreach (byte b in bytes)
                hex.AppendFormat("{0:x2}", b);
            return hex.ToString();
        }
    }
}
