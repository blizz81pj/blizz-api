﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;

namespace BeerStuff.DataAccess.Entities.BeerNetContext.Models
{
    public partial class BeerYeast
    {
        public BeerYeast()
        {
            BeerRecipeYeast = new HashSet<BeerRecipeYeast>();
        }

        public uint BeerYeastId { get; set; }
        public string Name { get; set; }
        public bool? IsKettleSour { get; set; }

        public virtual ICollection<BeerRecipeYeast> BeerRecipeYeast { get; set; }
    }
}