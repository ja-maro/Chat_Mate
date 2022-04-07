import { colours } from "./colours";

export const documentation = {
  intro:
    "Bienvenue sur Chat Time \n These are our chats commands\n Use them wisely\n",
  cmds: colours.bright + "usage : [--command]" + colours.reset
  + colours.bright + "\nexit"  + colours.reset
    + "\t\t\t\tquit the application"
  + colours.bright + "\nhelp" + colours.reset
    + "\t\t\t\tshow the documentation and list of our commands"
  + colours.bright + "\nlogin" + colours.reset + " <your login>"
    + "\t\tlogin into your account"
  + colours.bright + "\nregister" + colours.reset + " <login> <password>"
    + "\tcreate an account"
  + colours.bright + "\njoin" + colours.reset + " <room name>"
    + "\t\tjoin an existing room"
  + colours.bright + "\ncreate_room" + colours.reset + " <room name>"
    + "\t\tcreate a new room",
  error:
    "This command doesn't exit.\n Refer yourself to our documentation for more informations with the command : --help",
};
