using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.API
{
    /// <summary>
    /// Api return user details
    /// </summary>
    public class UserDetails
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
        /// RowVersion for concurrency check
        /// </summary>
        [Required]
        [Timestamp]
        public byte[]? RowVersion { get; set; }
    }
}
