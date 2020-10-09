using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HorseBetting.Entities;
using iCollect.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace iCollect.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]"), Produces("application/json"), EnableCors("AppPolicy")]
    public class TournamentsController : Controller
    {
        private readonly HorseBettingContext _context;

        public TournamentsController(HorseBettingContext context)
        {
            _context = context;
        }

        //[Authorize(Roles = "Admin")]
        [HttpGet, Route("getTournaments")]
        public ActionResult getTournaments()
        {
            try
            {
                System.Security.Claims.ClaimsPrincipal currentUser = this.User;
                var username = User.Identities.First().Name;
                bool IsAdmin = currentUser.IsInRole("Admin");
                var tournaments = _context.Tournament.ToList();

                return Json(new
                {
                    tournaments
                });
            }
            catch (Exception ex)
            {
                // _logger.LogError(ex, "Error occured on update set");
                throw new NotImplementedException(ex.Message);
            }
        }

        // [Authorize(Roles = "Admin")]
        [HttpPut("updateTournament")]
        public ActionResult<int> updateTournament([FromBody] Tournament data)
        {
            try
            {
                _context.Update(data);
                int rc = _context.SaveChanges();
                return rc;
            }
            catch (Exception ex)
            {
                // _logger.LogError(ex, "Error occured on update set");
                throw new NotImplementedException(ex.Message);
            }
        }

        [Authorize]
        [HttpGet("deleteTournament/{tournamentId}")]
        public ActionResult<int> deleteTournament(int tournamentId)
        {
            try
            {
                var par_tournamentId = new SqlParameter("@tournamentId", tournamentId);
                var result = _context.Database.ExecuteSqlRaw("EXEC spDeleteTournament @tournamentId", par_tournamentId);

                return result;
            }
            catch (Exception ex)
            {
                // _logger.LogError(ex, "Error occured on update set");
                throw new NotImplementedException(ex.Message);
            }
        }
    }
}