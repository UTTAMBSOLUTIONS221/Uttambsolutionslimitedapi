namespace Uttambsolutionslimitedstaffs.Models
{
    public class Uttambsolutionsstaffresponce
    {
        public int RespStatus { get; set; }
        public string? RespMessage { get; set; }
        public string? Token { get; set; }
        public int Expiresin { get; set; }
        public Usermodeldataresponce? Usermodel { get; set; }
    }
    public class Usermodeldataresponce
    {
        public int Loginid { get; set; }
        public string? Fullname { get; set; }
        public string? Phonenumber { get; set; }
        public string? Emailaddress { get; set; }
        public string? Passwordhash { get; set; }
        public string? Passwords { get; set; }
        public int Roleid { get; set; }
        public int Loginstatus { get; set; }
    }
}
