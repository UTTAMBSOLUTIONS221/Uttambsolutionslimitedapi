using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Uttambsolutionslimitedstaffs.Models
{
    [Table("Uttambsolutionslimitedpermission", Schema = "dbo")]
    public class Uttambsolutionslimitedpermission
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("Permissionid")]
        public int Permissionid { get; set; }
        [Column("Permissionname")]
        public string? Permissionname { get; set; }
        [Column("Permissionmodule")]
        public string? Permissionmodule { get; set; }
        [Column("Permissionadmin")]
        public bool Permissionadmin { get; set; }
        [Column("Isactive")]
        public bool Isactive { get; set; }
        [Column("Isdeleted")]
        public bool Isdeleted { get; set; }
    }
}
