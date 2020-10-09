using System;
using System.Collections.Generic;

namespace HorseBetting.Entities
{
    public partial class EventDetailStatus
    {
        public EventDetailStatus()
        {
            EventDetail = new HashSet<EventDetail>();
        }

        public short EventDetailStatusId { get; set; }
        public string EventDetailStatusName { get; set; }

        public virtual ICollection<EventDetail> EventDetail { get; set; }
    }
}
