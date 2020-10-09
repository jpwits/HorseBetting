﻿using System;
using System.Collections.Generic;

namespace HorseBetting.Entities
{
    public partial class Tournament
    {
        public Tournament()
        {
            Event = new HashSet<Event>();
        }

        public long TournamentId { get; set; }
        public string TournamentName { get; set; }

        public virtual ICollection<Event> Event { get; set; }
    }
}
