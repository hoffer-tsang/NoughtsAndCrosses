/*==============================================================================
 *
 * Update password when forget password
 *
 * Copyright © Dorset Software Training, 2023
 *
 * TSD Section: Noughts and Crosses
 *
 *============================================================================*/
using System.ComponentModel.DataAnnotations;

namespace Models.API
{
    /// <summary>
    /// Contain details need to update password
    /// </summary>
    public class ForgettenPassword
    {
        /// <summary>
        /// User Email
        /// </summary>
        [Required]
        [StringLength(256)]
        public string? Email { get; set; }

        /// <summary>
        /// Password of user to login
        /// </summary>
        [Required]
        public string? Password { get; set; }

        /// <summary>
        /// RowVersion for concurrency check
        /// </summary>
        [Required]
        [Timestamp]
        public byte[]? RowVersion { get; set; }
    }
}
