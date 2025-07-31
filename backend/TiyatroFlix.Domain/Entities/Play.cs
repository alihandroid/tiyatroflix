using System;

namespace TiyatroFlix.Domain.Entities
{
    public class Play
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        // TODO: Create a separate Director entity later
        public string Director { get; set; }
        public string PosterImageUrl { get; set; }
        public string TrailerUrl { get; set; }
        public string VideoUrl { get; set; }
    }
}