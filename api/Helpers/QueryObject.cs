using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Helpers
{
    public class QueryObject
    {
        // Filtering
        public string? Symbol { get; set; } = null;
        public string? CompanyName { get; set; } = null;

        // Sorting
        public string? SortBy { get; set; } = null;        // "Symbol" | "LastDiv"
        public bool IsDescending { get; set; } = false;

        // Pagination
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }
}