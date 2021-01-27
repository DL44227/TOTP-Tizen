# TOTP-Tizen
TOTP client for Tizen Smartwatches.

This is a fork from tesurijp/TOTP-Tizen, with support for SHA-256-HMAC
and SHA-512-HMAC.

# Setup

You need to create a file "auth_keyinfo.txt" like following:  
  Service1:Account_A:JBSWY3DPEHPK3PXP
  Service2:Account_B:JBSWY3DPEHPK3PXP:6
  Service3:Account_C:JBSWY3DPEHPK3PXP:9
  Service4:Account_D:JBSWY3DPEHPK3PXP:6:SHA-256
  ....

  Service1/2/3 is service name (eg. Google/Microsoft).

  Account... is account in service. (eg. your@mail.com).

  JBSW... is TOTP secret key.

  The optional digit in field defines the amount of digits displayed, 
  default ist 6.

  The optional HMAC field defines the HMAC to be used:
    SHA-1 (default)
    SHA-256
    SHA-512

Copy the file to device by using one of the following ways:

 1. Copy the file to GEAR://documents/auth_keyinfo.txt from PC via USB.
 1. Copy auth_keyinfo.txt to GEAR://documents/ (via utility such as Filesmaster)
 1. Copy auth_keyinfo.txt to GEAR://downloads/ (by SDK connection)
 1. Copy auth_keyinfo.mp3 to GEAR://music/
    1. rename auth_keyinfo.txt to auth_keyinfo.mp3 (Change only the file name, do not change contents)
    1. push it as music data by GearManager 
 1. Use sdb: ./tizen-studio/tools/sdb push auth_keyinfo.txt /home/owner/media/Documents/

