
  // output: string = ''
  // parser: any
  // config: any
  // zotero: any

  // CLI code
  /*
  public function getParser() {
    // global parameters for all commands
    this.parser = new ArgumentParser
    this.parser.addArgument('--api-key', { help: 'The API key to access the Zotero API.' })
    this.parser.addArgument('--config', { type: arg.file, help: 'Configuration file (toml format). Note that ./zotero-cli.toml and ~/.config/zotero-cli/zotero-cli.toml is picked up automatically.' })
    this.parser.addArgument('--user-id', { type: arg.integer, help: 'The id of the user library.' })
    this.parser.addArgument('--group-id', { type: arg.integer, help: 'The id of the group library.' })
    // See below. If changed, add: You can provide the group-id as zotero-select link (zotero://...). Only the group-id is used, the item/collection id is discarded.
    this.parser.addArgument('--indent', { type: arg.integer, help: 'Identation for json output.' })
    this.parser.addArgument('--out', { help: 'Output to file' })
    this.parser.addArgument('--verbose', { action: 'storeTrue', help: 'Log requests.' })

    const subparsers = this.parser.addSubparsers({ title: 'commands', dest: 'command', required: true })
    // add all methods that do not start with _ as a command
    for (const cmd of Object.getOwnPropertyNames(Object.getPrototypeOf(this)).sort()) {
      if (typeof this[cmd] !== 'function' || cmd[0] !== '$') continue

      const sp = subparsers.addParser(cmd.slice(1).replace(/_/g, '-'), { description: this[cmd].__doc__, help: this[cmd].__doc__ })
      // when called with an argparser, the command is expected to add relevant parameters and return
      // the command must have a docstring
      this[cmd](sp)
    }
  }

  // needs to go into CLI
  //  this.args = this.parser.parseArgs()
*/
readConfig(args) {
    // pick up config
    /* 
    Called during initialisation.

    INPUT:

    args = {
      config: "zotero-lib.toml"
    }

    or

    args = {
      user-id: "XXX",
      group-id: "123",
      library-type: "group",
      indent = 4,
      api-key: "XXX"
    } 

    OUTPUT:

    this.config = {
      user-id: "XXX",
      group-id: "123",
      library-type: "group",
      indent = 4,
      api-key: "XXX"
    }

    */

    this.args = args
  
    const config: string = [this.args.config, 'zotero-cli.toml', `${os.homedir()}/.config/zotero-cli/zotero-cli.toml`].find(cfg => fs.existsSync(cfg))
    this.config = config ? toml.parse(fs.readFileSync(config, 'utf-8')) : {}

    if (this.args.user_id || this.args.group_id) {
      //Overwriting command line option in config
      delete this.config['user-id']
      delete this.config['group-id']

      this.config['user-id'] = this.args.user_id
      this.config['group-id'] = this.args.group_id

      if (!this.config['user-id']) delete this.config['user-id']
      if (!this.config['group-id']) delete this.config['group-id']
    }


    /*
    Optional arguments:
  -h, --help            Show this help message and exit.
  --api-key API_KEY     The API key to access the Zotero API.
  --config CONFIG       Configuration file (toml format). Note that .
                        /zotero-cli.toml and ~/.config/zotero-cli/zotero-cli.
                        toml is picked up automatically.
  --user-id USER_ID     The id of the user library.
  --group-id GROUP_ID   The id of the group library.
  --indent INDENT       Identation for json output.
  --out OUT             Output to file
  --verbose             Log requests.
*/
  /*
    // expand selected command
    const options = [].concat.apply([], this.parser._actions.map(action => action.dest === 'command' ? action.choices[this.args.command] : [action]))
    for (const option of options) {
      if (!option.dest) continue
      if (['help', 'config'].includes(option.dest)) continue

      if (this.args[option.dest] !== null) continue

      let value

      // first try explicit config
      if (typeof value === 'undefined' && this.args.config) {
        value = (this.config[this.args.command] || {})[option.dest.replace(/_/g, '-')]
        if (typeof value === 'undefined') value = this.config[option.dest.replace(/_/g, '-')]
      }

      // next, ENV vars. Also picks up from .env
      if (typeof value === 'undefined') {
        value = process.env[`ZOTERO_CLI_${option.dest.toUpperCase()}`] || process.env[`ZOTERO_${option.dest.toUpperCase()}`]
      }

      // last, implicit config
      if (typeof value === 'undefined') {
        value = (this.config[this.args.command] || {})[option.dest.replace(/_/g, '-')]
        if (typeof value === 'undefined') value = this.config[option.dest.replace(/_/g, '-')]
      }

      if (typeof value === 'undefined') continue

      if (option.type === arg.integer) {
        if (isNaN(parseInt(value))) this.parser.error(`${option.dest} must be numeric, not ${value}`)
        value = parseInt(value)

      } else if (option.type === arg.path) {
        if (!fs.existsSync(value)) this.parser.error(`${option.dest}: ${value} does not exist`)

      } else if (option.type === arg.file) {
        if (!fs.existsSync(value) || !fs.lstatSync(value).isFile()) this.parser.error(`${option.dest}: ${value} is not a file`)

      } else if (option.type === arg.json && typeof value === 'string') {
        try {
          value = JSON.parse(value)
        } catch (err) {
          this.parser.error(`${option.dest}: ${JSON.stringify(value)} is not valid JSON`)
        }

      } else if (option.choices) {
        if (!option.choices.includes(value)) this.parser.error(`${option.dest} must be one of ${option.choices}`)

      } else if (option.action === 'storeTrue' && typeof value === 'string') {
        const _value = {
          true: true,
          yes: true,
          on: true,

          false: false,
          no: false,
          off: false,
        }[value]
        if (typeof _value === 'undefined') this.parser.error(`%{option.dest} must be boolean, not ${value}`)
        value = _value

      } else {
        // string
      }

      this.args[option.dest] = value
    } */

    if (!this.args.api_key) this.parser.error('no API key provided')
    this.headers['Zotero-API-Key'] = this.args.api_key

    if (this.args.user_id === null && this.args.group_id === null) this.parser.error('You must provide exactly one of --user-id or --group-id')
    if (this.args.user_id !== null && this.args.group_id !== null) this.parser.error('You must provide exactly one of --user-id or --group-id')
    if (this.args.user_id === 0) this.args.user_id = (await this.get(`/keys/${this.args.api_key}`, { userOrGroupPrefix: false })).userID



    // Could do this here:
    //if (this.args.group_id) {
    //      this.args.group_id = this.extractGroup(this.args.group_id)
    //if (!this.args.group_id) {
    //this.parser.error('Unable to extract group_id from the string provided via --group_id.')
    //return
    //}    
    //}


    // using default=2 above prevents the overrides from being picked up
    if (this.args.indent === null) this.args.indent = 2

    /*
    // call the actual command
    try {
      await this['$' + this.args.command.replace(/-/g, '_')]()
    } catch (ex) {
      this.print('Command execution failed: ', ex)
      process.exit(1)
    } */

  }