using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.Stock
{
    public class CreateStockRequestDto
    {
        [Required]
        [MinLength(1, ErrorMessage = "Symbol must be 1 character!")]
        [MaxLength(10, ErrorMessage = "Symbol can't be over 10 charactors")]
        public string Symbol { get; set; } = string.Empty;

        [Required]
        [MinLength(1, ErrorMessage = "Company name is required!")]
        [MaxLength(300, ErrorMessage = "Company name can't be over 300 charactors")]
        public string CompanyName { get; set; } = string.Empty;
        
        [Required]
        [Range(1, 1000000000000, ErrorMessage = "Purchase is not valid")]
        public decimal Purchase { get; set; }

        [Required]
        [Range(0.001, 100)]
        public decimal LastDiv { get; set; }  

        [Required]
        [MinLength(1)]
        [MaxLength(10)]  
        public string Industry { get; set; } = string.Empty;

        [Range(1, 5000000000000)]
        public long MarketCap { get; set; }

    }
}