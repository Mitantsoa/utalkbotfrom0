const {config} = require('dotenv');
const { Client, Collection, Events, GatewayIntentBits,Message } = require('discord.js');
// const { BOT_TOKEN} =require('./conf.json');
const fs = require('node:fs')
const path = require('node:path');
// const modalhandler = require('./componentHandler/modal.js')
// const buttonhandler = require('./componentHandler/button.js')
// const singleselecthandler = require('./componentHandler/singleselectmenu.js')
// const {checkAgentExist} = require('./service/auth')
// load env
config();

/*
 configuration env
 */
const TOKEN = process.env.BOT_TOKEN;
// const clientId = process.env.BOT_CLIENTID;


/*
  this is to allow to receive event for guild and guildMessages
  And initialize client
 */
const client = new Client({intents:[
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]});


/*
  Configuring list of commands
 */
client.commands = new Collection();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const commandsPath = path.join(__dirname, 'commands');
// const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('js'));
//
// for (const file of commandFiles) {
//     const filePath = path.join(commandsPath, file);
//     const command = require(filePath);
//     // console.log(command);
//     // Set a new item in the Collection with the key as the command name and the value as the exported module
//     if ('data' in command && 'execute' in command) {
//         client.commands.set(command.data.name, command);
//     } else {
//         console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
//     }
// }

// client.login(TOKEN);
// console.log(client)

/*
	listen slash command
 */
// client.on(Events.InteractionCreate, async (interaction,client) => {
//     // const custonid = interaction.customId;
//     // interaction.user.marticul = 'U005'
//
//     const _agentTag = interaction.user.tag;
//     await interaction.deferReply({ephemeral:true});
//     const _isAgentExist = await checkAgentExist(interaction)
//     console.log("checkAgentExist",_isAgentExist)
//     if(!_isAgentExist){
//         await interaction.editReply({content:`Le login ${_agentTag} n'est pas encore enregister merci contacter le superviseur`})
//     }else{
//         if(interaction.isStringSelectMenu()){
//
//             await singleselecthandler(interaction)
//
//         }else if (interaction.isButton()){
//
//             await buttonhandler(interaction)
//
//         } else if (interaction.isModalSubmit()){
//
//             await modalhandler(interaction);
//
//         }else if (interaction.isChatInputCommand()){
//
//             const command = interaction.client.commands.get(interaction.commandName);
//
//             if (!command) {
//                 console.error(`No command matching ${interaction.commandName} was found.`);
//                 return;
//             }
//
//             try {
//                 await command.execute(interaction);
//             } catch (error) {
//                 console.error(error);
//                 if (interaction.replied || interaction.deferred) {
//                     await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
//                 } else {
//                     await interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true });
//                 }
//             }
//
//         }else {
//             console.log(interaction)
//         }
//     }
//
//
//
// });

module.exports = client;

// client.on(Events.InteractionCreate, interaction => {
// 	if (!interaction.isModalSubmit()) return;
//
// 	// Get the data entered by the user
// 	const username = interaction.fields.getTextInputValue('username');
// 	const uid = interaction.fields.getTextInputValue('uid');
// 	const tag = interaction.fields.getTextInputValue('tag');
// 	console.log({ username, uid,tag });
// });


// exports.utalkBot = functions.https.onRequest(async () => {
// 	await main();
// });

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
