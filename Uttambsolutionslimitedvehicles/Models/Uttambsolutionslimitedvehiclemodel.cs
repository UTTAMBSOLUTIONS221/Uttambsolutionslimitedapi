using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Uttambsolutionslimitedvehicles.Models
{

    [Table("Uttambsolutionslimitedvehiclemodel", Schema = "dbo")]
    public class Uttambsolutionslimitedvehiclemodel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("Vehiclemodelid")]
        public int Vehiclemodelid { get; set; }

        [Column("Vehiclemodelname")]
        public string? Vehiclemodelname { get; set; }

        [ForeignKey("Uttambsolutionslimitedvehiclemake")]
        [Column("Vehiclemakeid")]
        public int Vehiclemakeid { get; set; }

        // Navigation property for the related make
        public Uttambsolutionslimitedvehiclemake? Uttambsolutionslimitedvehiclemake { get; set; }

    }
}
