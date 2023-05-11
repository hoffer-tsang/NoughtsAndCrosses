/*==============================================================================
 *
 * User Login Entity FrameWork
 *
 * Copyright © Dorset Software Training, 2023
 *
 * TSD Section: Noughts and Crosses
 *
 *============================================================================*/
using System.ComponentModel.DataAnnotations;

namespace Models.EntityFrameWork
{
    /// <summary>
    /// Entity Framework Model for UserLogin in database, contain user details for login
    /// </summary>
    public class UserLogin
    {
        /// <summary>
        /// User Id
        /// </summary>
        [Key]
        [Required]
        public Guid Id { get; set; }

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
        /// Salt of User
        /// </summary>
        [Required]
        [StringLength(256)]
        public string? Salt { get; set; }

        /// <summary>
        /// Password of user to login
        /// </summary>
        [Required]
        [StringLength(256)]
        public string? HashedPassword { get; set; }

        /// <summary>
        /// RowVersion for concurrency check
        /// </summary>
        [Required]
        [Timestamp]
        public byte[]? RowVersion { get; set; }
    }
}
