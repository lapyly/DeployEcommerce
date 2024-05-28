const { identifier } = require("../configs/app.config");
const transport = require("../configs/nodemailer.config");
const logger = require("../factory/winston.factory");

class MailAdapter {
  async sendMessage(userInfo, messageInfo) {
    if (!transport.auth || !transport.auth.user) {
        logger.debug("Mail transport configuration is missing.");
    }
    const toMail = userInfo.email;
    const toName = userInfo.name;
    try {
      const mail = await transport.sendMail({
        from: `"Password need help" <${identifier}>`,
        to: toMail,
        subject: "Restore password",
        html: `
          <div>
            <h1>Hello ${toName}, problems with your password?</h1>
            <div>
              <div>To restore it, follow this link:</div>
              <a href="${messageInfo}">${messageInfo}</a>
            </div>
          </div>
        `,
      });
      logger.debug(`Mail sent: ${JSON.stringify(mail)}`);
      return mail;
    } catch (error) {
      logger.error(`Error sending mail: ${error.message}`);
      throw error;
    }
  }

  async deleteUsers(userInfo) {
        if (!transport.auth || !transport.auth.user) {
          logger.debug("Mail transport configuration is missing.");
          }
        const toMail = userInfo.email;
        const toName = userInfo.name;
    try {
      const mail = await transport.sendMail({
        from: `"Sorry to lost you!" <${identifier}>`,
        to: toMail,
        subject: "Goodbye",
        html: `
              <div>
                <h1>Hello ${toName}, we are sorry to loose you.</h1>
                <div>
                  <div>As you don't use our website in more than a month, we are gooing to delete your account for security reason.</div>
                    <h2>You can always come back!</h1>
                </div>
              </div>
            `,
      });
      logger.debug(`Mail sent: ${JSON.stringify(mail)}`);
      return mail;
    } catch (error) {
      logger.error(`Error sending mail: ${error.message}`);
      throw error;
    }
  }

  async purchase(userInfo) {
       if (!transport.auth || !transport.auth.user) {
         logger.debug("Mail transport configuration is missing.");
       }
        const toMail = userInfo.email;
        const toName = userInfo.name;
        const cart = userInfo.cart;
       try {
         const mail = await transport.sendMail({
           from: `"Thank to buy!" <${identifier}>`,
           to: toMail,
           subject: "Check purchase",
           html: `
              <div>
                <h1>Hello ${toName}!</h1>
                <div>
                  <div>Check your purchase:</div>
                  <ul>
                     ${cart
                       .map(
                         (p) =>
                           `<li>${p.product}: ${p.quantity}</li>`
                       )
                       .join("")}
                    </ul>
                  <h2>See you soon!</h1>
                </div>
              </div>
            `,
         });
         logger.debug(`Mail sent: ${JSON.stringify(mail)}`);
         return mail;
       } catch (error) {
         logger.error(`Error sending mail: ${error.message}`);
         throw error;
       }
  }
}

module.exports = MailAdapter;
