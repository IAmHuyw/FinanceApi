using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class UserDetail
    {
        public int Id { get; set; }
        public string? Bio { get; set; }
        public string? AvatarUrl { get; set; }
        public string AppUserId { get; set; } = string.Empty;

        // Navigation
        public AppUser AppUser { get; set; } = null!;
    }
}