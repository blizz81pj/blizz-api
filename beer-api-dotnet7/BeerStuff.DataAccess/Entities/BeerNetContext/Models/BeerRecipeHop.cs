﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;

namespace BeerStuff.DataAccess.Entities.BeerNetContext.Models
{
    public partial class BeerRecipeHop
    {
        public uint BeerRecipeHopId { get; set; }
        public uint BeerRecipeId { get; set; }
        public uint BeerHopId { get; set; }
        public decimal Amount { get; set; }
        public int? BoilMinute { get; set; }
        public bool? IsDryHop { get; set; }

        public virtual BeerHop BeerHop { get; set; }
        public virtual BeerRecipe BeerRecipe { get; set; }
    }
}