import { colours } from "./colours";

export const documentation = {
  intro:
    "Bienvenue sur Chat Mate \n Voici la liste de nos commandes\n Un grand pouvoir implique de grandes responsabilités !\n",
  cmds:
    colours.bright +
    "usage : [--command]" +
    colours.reset +
    colours.bright +
    "\nexit" +
    colours.reset +
    "\t\t\t\tquitter l'application" +
    colours.bright +
    "\nhelp" +
    colours.reset +
    "\t\t\t\tafficher la liste des commandes" +
    colours.bright +
    "\nlogin" +
    colours.reset +
    " <login>" +
    "\t\ts'authentifier" +
    colours.bright +
    "\nregister" +
    colours.reset +
    " <login> <password>" +
    "\ts'inscrire" +
    colours.bright +
    "\njoin" +
    colours.reset +
    " <nom de room>" +
    "\t\trejoindre une room existante" +
    colours.bright +
    "\ncreate_room" +
    colours.reset +
    " <nom de room>" +
    "\t\tcréer une nouvelle room" +
    colours.bright +
    "\nget_rooms" +
    colours.reset +
    "\t\tafficher la liste des rooms" +
    colours.bright +
    "\nget_users" +
    colours.reset +
    "\t\tafficher la liste des utilisateurs connectés" +
    colours.bright +
    "\nhist" +
    colours.reset +
    "\t\tafficher la liste des messages envoyés dans le room",
  error:
    "This command doesn't exit.\n Refer yourself to our documentation for more informations with the command : --help",
};
