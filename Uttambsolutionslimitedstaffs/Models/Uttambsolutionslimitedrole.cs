using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Uttambsolutionslimitedstaffs.Models
{
    [Table("Uttambsolutionslimitedrole", Schema = "dbo")]
    public class Uttambsolutionslimitedrole
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("Roleid")]
        public int Roleid { get; set; }
        [Column("Rolename")]
        public string? Rolename { get; set; }
        [Column("Roledescription")]
        public string? Roledescription { get; set; }
        [Column("Isactive")]
        public bool Isactive { get; set; }
        [Column("Isdeleted")]
        public bool Isdeleted { get; set; }
        [Column("Isdefault")]
        public bool Isdefault { get; set; }
    }
}
