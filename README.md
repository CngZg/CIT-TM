# CIT-TM
This is a simple web app built with React that uses a model trained with Google Teachable Machine. Test it out locally!

This was created by Caveng Zhang for the _"AI Hands ON"_ Workshop at **Universidad Tecnológica del Centro (Unitec)**

#### Introduction

Hi **everyone**, hope you are doing well! In this mini tutorial, I'll show you how to install and run this React App **on** your computer and even **on** your phone.

#### TM Model Trained

First, you will need a **trained** model from Teachable Machine. If you don't have one yet, check out my previous post where I guide you through that process step-by-step.
HERE: https://www.linkedin.com/feed/update/urn:li:activity:7401030538997936128/

#### Clonning the code

You have two options to get the code. If you have Git installed, simply run this command **in** your terminal:


``` cmd
git clone https://github.com/CngZg/CIT-TM
```

This will clone the project into your current directory. **Make sure you are in the folder where you want the project to be.**

Alternatively, you can download the code directly from GitHub as a ZIP file.

#### Installing the dependencies

First, ensure you have Node.js installed by running:

``` cmd

node --version

```

Next, navigate to the project directory and run the following command to install the dependencies:

``` cmd

npm i --legacy-peer-deps

```

Once the installation is complete, you can start the app on your machine using:

``` cmd

npm run dev

```

You might see a message saying **'N vulnerabilities found'**. This is simply because the **Teachable Machine libraries** haven't been updated in a few years, so they rely on older dependencies. But don't worry, it is completely normal and safe for the purpose of this app

**Notes for the curious:** Curious users might notice another command in `package.json` called `npm run dev-local`. This command exposes the app to your local network. However, keep in mind that browsers often block camera access on insecure (HTTP) connections. To use the camera over the local network this way, you would need to generate your own SSL certificates.

``` cmd
npm run dev-local
```

So, let's stick to the standard way.

#### Running on your mobile device

If you want to run this **on** your phone, we can use the amazing **Port Forwarding** tool built into VS Code to create a tunnel. _(Show the process)_

This generates a URL that allows you to access your app, even outside your current network. With a SSL certificate on it! 
**Security Note:** Be careful not to share this address publicly, as it tunnels traffic directly to your computer.

You can leave the 'Private' option **turned on**, but it will redirect everyone to a GitHub login page that requires **your** specific account. Other users won't be able to access the app even with their own accounts, which makes sharing it with friends very difficult!

With that said, enjoy the app! Feel free to share the models you have **tested** in the comments below!
#### Wraps up

I hope you learned something today and enjoyed this video as much as I enjoyed making it. Please **repost** and share this with your network if you found it helpful!
