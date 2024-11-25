using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Uttambsolutionslimitedstaffs.Models
{
    [Table("Uttambsolutionslimitedrolepermission", Schema = "dbo")]
    public class Uttambsolutionslimitedrolepermission
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [ForeignKey("Role")]
        public int Roleid { get; set; }

        [ForeignKey("Permission")]
        public int Permissionid { get; set; }

        // Navigation properties
        public virtual Uttambsolutionslimitedrole Role { get; set; }
        public virtual Uttambsolutionslimitedpermission Permission { get; set; }
    }
}
