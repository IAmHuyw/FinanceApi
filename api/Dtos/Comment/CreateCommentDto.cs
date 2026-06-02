using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.Comment
{
    public class CreateCommentDto
    {

        [Required]
        [MinLength(1,ErrorMessage = "Title cannot be empty")]
        [MaxLength(500,ErrorMessage = "Title cannot be over 500 charactors")]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MinLength(1,ErrorMessage = "Title cannot be empty")]
        public string Content { get; set; } = string.Empty;
    }
}