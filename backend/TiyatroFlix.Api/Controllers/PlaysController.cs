using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TiyatroFlix.Domain.Entities;
using TiyatroFlix.Infrastructure.Persistence;

namespace TiyatroFlix.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlaysController : ControllerBase
    {
        private readonly TiyatroFlixDbContext _context;

        public PlaysController(TiyatroFlixDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Play>>> GetPlays()
        {
            return await _context.Plays.ToListAsync();
        }
    }
}