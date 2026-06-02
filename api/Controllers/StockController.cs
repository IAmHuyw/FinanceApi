using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Data;
using api.Mappers;
using api.Dtos.Stock;
using api.Models;
using Microsoft.AspNetCore.Http;
using api.Interfaces;
using api.Repository;
using api.Helpers;

namespace api.Controllers
{
    [Route("api/stock")]
    [ApiController]
    public class StockController : ControllerBase
    {
        private readonly IStockRepository _stockRepo;
        public StockController(IStockRepository stockRepo)
        {
            _stockRepo = stockRepo;
        }

        [HttpGet]
        public async Task<ActionResult<StockDto>> GetStocks([FromQuery] QueryObject query)
        {
            var stocks = await _stockRepo.GetAllAsync(query);
            var stockDtos = stocks.Select(s => StockMappers.ToStockDto(s)).ToList();
            return Ok(stockDtos);
        }

        // GET /api/stock/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<StockDto>> GetById([FromRoute] int id)
        {
            var stock = await _stockRepo.GetByIdAsync(id);

            if (stock == null)
                return NotFound();

            return Ok(StockMappers.ToStockDto(stock));
        }

        // Thêm vào StockController.cs
        [HttpPost]
        public async Task<ActionResult<StockDto>> Create([FromBody] CreateStockRequestDto stockDto)
        {
            var stockModel = stockDto.ToStockFromCreateDTO();
            // await _context.Stocks.AddAsync(stockModel);
            // await _context.SaveChangesAsync();
            await _stockRepo.CreateAsync(stockModel);
            return CreatedAtAction(nameof(GetById),
                new { id = stockModel.Id },
                stockModel.ToStockDto());
        }

        //Update
        [HttpPut("{id}")]
        public async Task<ActionResult<StockDto>> Update([FromRoute] int id, [FromBody] UpdateStockRequestDto stockDto)
        {
            // var stock = await _context.Stocks.FirstOrDefaultAsync(s => s.Id == id);

            // if (stock == null)
            //     return NotFound();

            // stock.Symbol = stockDto.Symbol;
            // stock.CompanyName = stockDto.CompanyName;
            // stock.Purchase = stockDto.Purchase;
            // stock.LastDiv = stockDto.LastDiv;
            // stock.Industry = stockDto.Industry;
            // stock.MarketCap = stockDto.MarketCap;

            // await _context.SaveChangesAsync();
            var stock = await _stockRepo.UpdateAsync(id, stockDto);
            if (stock == null)
                return NotFound();

            return Ok(stock.ToStockDto());
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<StockDto>> Delete([FromRoute] int id)
        {
            // var stock = await _context.Stocks.FirstOrDefaultAsync(s => s.Id == id);

            // if (stock == null)
            //     return NotFound();

            // _context.Stocks.Remove(stock);
            // await _context.SaveChangesAsync();

            var stock = await _stockRepo.DeleteAsync(id);
            if (stock == null)
                return NotFound();

            return Ok(stock.ToStockDto());
        }
    }
}