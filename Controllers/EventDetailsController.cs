﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HorseBetting.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace HorseBetting.Controllers
{
    [Route("api/[controller]"), Produces("application/json"), EnableCors("AppPolicy")]
    public class EventDetailsController : Controller
    {

        private readonly HorseBettingContext _context;

        public EventDetailsController(HorseBettingContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpGet, Route("GetEventDetails/{eventId}")]
        public ActionResult GetEventDetails(int eventId)
        {
            try
            {
                var eventDetails = _context.EventDetail
                .Where(a => a.FkEventId == eventId)
                .ToList();

                return Json(new
                {
                     eventDetails 
                });
            }
            catch (Exception ex)
            {
                // _logger.LogError(ex, "Error occured on update set");
                throw new NotImplementedException(ex.Message);
            }
        }

        [Authorize]
        [HttpPut("updateEventDetail")]
        public ActionResult<int> updateEventDetail([FromBody] EventDetail data)
        {
            try
            {
                _context.Update(data);
                int rc =  _context.SaveChanges();
                return rc;
            }
            catch (Exception ex)
            {
                // _logger.LogError(ex, "Error occured on update set");
                throw new NotImplementedException(ex.Message);
            }
        }

        [HttpGet, Route("GetEventDetailStatus")]
        public ActionResult GetEventDetailStatus()
        {
            try
            {
                return Json(new
                {
                    detailStatuses= _context.EventDetailStatus.ToList()
                });
            }
            catch (Exception ex)
            {
                // _logger.LogError(ex, "Error occured on update set");
                throw new NotImplementedException(ex.Message);
            }
        }
    }
}