/*==============================================================================
 *
 * Create a new User
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
    /// Contain details of a new user
    /// </summary>
    public class NewUser
    {
        /// <summary>
        /// UserName
        /// </summary>
        [Required]
        [StringLength(256)]
        public string? UserName { get; set; }

        /// <summary>
        /// Email of user for forgetten password
        /// </summary>
        [Required]
        [StringLength(256)]
        public string? Email { get; set; }

        /// <summary>
        /// Password of user to login
        /// </summary>
        [Required]
        public string? Password { get; set; }
    }
}
