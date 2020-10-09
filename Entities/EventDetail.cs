using System;
using System.Collections.Generic;

namespace HorseBetting.Entities
{
    public partial class EventDetail
    {
        public long EventDetailId { get; set; }
        public long FkEventId { get; set; }
        public short? FkEventDetailStatusId { get; set; }
        public string EventDetailName { get; set; }
        public short? EventDetailNumber { get; set; }
        public decimal? EventDetailOdd { get; set; }
        public short? FinishingPosition { get; set; }
        public bool? FirstTimer { get; set; }

        public virtual Event FkEvent { get; set; }
        public virtual EventDetailStatus FkEventDetailStatus { get; set; }
    }
}
