export const Severity = {
  INFO: "INFO",
  WARNING: "WARNING",
  ERROR: "ERROR",

  WELCOME: "WELCOME",
} as const;

const welcomeMessages = [
  {
    // make the timestarts at october 1st and the current year
    time: [new Date(2023, 9, 1), new Date(2023, 9, 31)],
    // a halloween color orange type
    color: "#ff6600",
    message: `


    ██╗░░██╗░█████╗░██████╗░██████╗░██╗░░░██╗  ██╗░░██╗░█████╗░██╗░░░░░██╗░░░░░░█████╗░░██╗░░░░░░░██╗███████╗███████╗███╗░░██╗
    ██║░░██║██╔══██╗██╔══██╗██╔══██╗╚██╗░██╔╝  ██║░░██║██╔══██╗██║░░░░░██║░░░░░██╔══██╗░██║░░██╗░░██║██╔════╝██╔════╝████╗░██║
    ███████║███████║██████╔╝██████╔╝░╚████╔╝░  ███████║███████║██║░░░░░██║░░░░░██║░░██║░╚██╗████╗██╔╝█████╗░░█████╗░░██╔██╗██║
    ██╔══██║██╔══██║██╔═══╝░██╔═══╝░░░╚██╔╝░░  ██╔══██║██╔══██║██║░░░░░██║░░░░░██║░░██║░░████╔═████║░██╔══╝░░██╔══╝░░██║╚████║
    ██║░░██║██║░░██║██║░░░░░██║░░░░░░░░██║░░░  ██║░░██║██║░░██║███████╗███████╗╚█████╔╝░░╚██╔╝░╚██╔╝░███████╗███████╗██║░╚███║
    ╚═╝░░╚═╝╚═╝░░╚═╝╚═╝░░░░░╚═╝░░░░░░░░╚═╝░░░  ╚═╝░░╚═╝╚═╝░░╚═╝╚══════╝╚══════╝░╚════╝░░░░╚═╝░░░╚═╝░░╚══════╝╚══════╝╚═╝░░╚══╝
    
    
    `,
  },
  {
    time: [new Date(2023, 11, 1), new Date(2023, 11, 31)],
    color: "#ff6600",
    message: `
    
░░░░░░░░░░ ★
░░░░░░░░░░██
░░░░░░░░░████
░░░░░░░██▒▒▒▒██
░░░░░██▒▒▒▒▒▒▒▒██
░░░░░░░██▒▒▒▒██
░░░░░░░░██████
░░░░░░░███▓▓███
░░░░░░░░█▓▓▓▓█
░░░░░░░█▓▓▓▓▓▓█
░░░░░░█▓▓▓▓▓▓▓▓█
░░░░░█▓▓▓▓▓▓▓▓▓▓█
░░░████▓▓▓▓▓▓▓▓████
░░█▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓█
░███████▓▓▓▓▓▓███████
░░░░░░█▓▓▓▓▓▓▓▓█
░░░░░█▓▓▓▓▓▓▓▓▓▓█
░░░░█▓▓▓▓▓▓▓▓▓▓▓▓█
░░███▓▓▓▓▓▓▓▓▓▓▓▓███
░█▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓█
███████▓▓▓▓▓▓▓▓███████
░░░░█▓▓▓▓▓▓▓▓▓▓▓▓█
░░░█▓▓▓▓▓▓▓▓▓▓▓▓▓▓█
░░█▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓█
░██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██
██████████████████████
░░░░░░░░██████
`,
  },
];

const consoleLog = (
  severity: (typeof Severity)[keyof typeof Severity],
  message?: any,
  ...optionalParams: any[]
) => {
  if (process.env.NODE_ENV === "development") {
    switch (severity) {
      case Severity.INFO:
        console.log(
          "%cℹ️ INFO:",
          "color: #3498db; font-weight: bold",
          message,
          ...optionalParams
        );
        break;
      case Severity.WARNING:
        console.warn(
          "%c⚠️ WARNING:",
          "color: #f39c12; font-weight: bold",
          message,
          ...optionalParams
        );
        break;
      case Severity.ERROR:
        console.error(
          "%c❌ ERROR:",
          "color: #e74c3c; font-weight: bold",
          message,
          ...optionalParams
        );
        break;
      case Severity.WELCOME:
        //current datre
        const currentDate = new Date();

        //loop through the welcome messages
        for (const welcomeMessage of welcomeMessages) {
          //check if the current date is between the start and end date
          if (
            currentDate >= welcomeMessage.time[0] &&
            currentDate <= welcomeMessage.time[1]
          ) {
            console.log(
              `%c${welcomeMessage.message}`,
              `color: ${welcomeMessage.color}; font-weight: bold`
            );
            break;
          }
        }
        break;
      default:
        console.log(message, ...optionalParams);
    }
  }
};

export { consoleLog };
