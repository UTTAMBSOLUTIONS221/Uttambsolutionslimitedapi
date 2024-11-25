using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Uttambsolutionslimitedvehicles.Models
{
    [Table("Uttambsolutionslimitedvehiclemake", Schema = "dbo")]
    public class Uttambsolutionslimitedvehiclemake
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("Vehiclemakeid")]
        public int Vehiclemakeid { get; set; }
        [Column("Vehiclemakename")]
        public string? Vehiclemakename { get; set; }
    }
}
