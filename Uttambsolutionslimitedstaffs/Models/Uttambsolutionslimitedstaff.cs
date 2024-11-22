using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Uttambsolutionslimitedstaffs.Models
{
    [Table("Uttambsolutionslimitedstaff", Schema = "dbo")]
    public class Uttambsolutionslimitedstaff
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("Staffid")]
        public int Staffid { get; set; }
        [Column("Firstname")]
        public string? Firstname { get; set; }
        [Column("Lastname")]
        public string? Lastname { get; set; }
        [Column("Emailaddress")]
        public string? Emailaddress { get; set; }
        [Column("Phonenumber")]
        public string? Phonenumber { get; set; }
        [Column("Roleid")]
        public int Roleid { get; set; }
        [Column("Passwords")]
        public string? Passwords { get; set; }
        [Column("Passwordhash")]
        public string? Passwordhash { get; set; }
        [Column("Loginstatus")]
        public int Loginstatus { get; set; }
        [Column("Confirmemail")]
        public bool Confirmemail { get; set; }
        [Column("Confirmphone")]
        public bool Confirmphone { get; set; }
        [Column("Changepassword")]
        public bool Changepassword { get; set; }
        [Column("Lastpasswordchange")]
        public DateTime Lastpasswordchange { get; set; } = DateTime.Now;
        [Column("Isactive")]
        public bool Isactive { get; set; }
        [Column("Isdeleted")]
        public bool Isdeleted { get; set; }
        [Column("Isdefault")]
        public bool Isdefault { get; set; }
        [Column("Createdby")]
        public int Createdby { get; set; }
        [Column("Modifiedby")]
        public int Modifiedby { get; set; }
        [Column("Datecreated")]
        public DateTime Datecreated { get; set; } = DateTime.Now;
        [Column("Datemodified")]
        public DateTime Datemodified { get; set; } = DateTime.Now;
    }
}
