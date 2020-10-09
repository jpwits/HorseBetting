using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Cors;
using iCollect.Entities;
using System.IO;
using System.Drawing;
using System.Text;
using Newtonsoft.Json;
using System.Drawing.Imaging;
using Microsoft.AspNetCore.Authorization;
using Z.EntityFramework.Plus;
using Newtonsoft.Json.Linq;
using HorseBetting.Entities;

namespace iCollect.Controllers
{
    [Route("api/[controller]"), Produces("application/json"), EnableCors("AppPolicy")]
    public class EventsController : Controller
    {
        private readonly HorseBettingContext _context;

        public EventsController(HorseBettingContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpGet, Route("GetEvents/{start}/{length}/{tournamentId}")]
        public ActionResult GetEvents(int start, int length, int tournamentId)
        {
            try
            {
                var qry = _context.Event
                //.Include(a => a.EventDetail)
                .Where(a => a.FkTournamentId == tournamentId)
                .AsQueryable();
                var recordsTotal = qry.Count();

                //qry = qry.Skip(start)
                //    .Take(length)
                //    .Include(a => a.Items);

                var events = qry.ToList();
                return Json(new
                {
                    recordsTotal,
                    events
                });
            }
            catch (Exception ex)
            {
                // _logger.LogError(ex, "Error occured on update set");
                throw new NotImplementedException(ex.Message);
            }
        }


        [Authorize]
        [HttpPut("updateEvent")]
        public ActionResult<int> updateEvent([FromBody] Event data)
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

    }
}

