const htmlTemplate = `
<dom-module id="app-styles">
<template>
  <style>
      :host {
      --dark-primary-color:       #040356;
      --default-primary-color:    #333333;
      --light-primary-color:      #096BA6;
      --text-primary-color:       #FFFFFF;
      --text-secondary-color:     #727173;
      --accent-color:             #43BC84;
      --primary-background-color: #096BA6;
      --paper-input-bg:           #fff;
      --disabled-color:           #727173;

      --tint-color: #08A195;
      --second-tint-color: #0DC4D7;
      --main-text-color:var(--text-secondary-color);
      font-family: 'Roboto', sans-serif;

      

      --custom-paper-input: {
        margin-bottom:165px;
        margin:auto;
        width:50vw;
        background-color:var(--paper-input-bg);
        border-radius:5px;
        padding-left:5px;
        padding-right:5px;
        min-width: 315px;
      }
      --primary-button: {
        border-radius:20px; 
        padding-left:25px; 
        padding-right:25px; 
        text-transform: capitalize;
        margin-right:20px;
        background-color:var(--accent-color);
        color:var(--text-primary-color);
        height:50px; 
        width: 200px;
      }

      --branche-logo: {
        height: 45px;
        padding-top:5px;
      }

}
    
    /* start my-app */

      app-toolbar { 
        background-color:var(--dark-primary-color);
        color:var(--text-primary-color);
        }

      #progressbar{
       top: 20px;
    }
      
      .logo img{
        @apply --branche-logo;
      }

      .main { 
        width:100vw; 
        height:95vh;
        color:var(--text-primary-color); 
        background-color:var(--dark-primary-color); 
        display:flex;
        flex-wrap:wrap;
        align-content:flex-start;
      }

      .textplace { 
        padding-top:26vh;
        padding-left: 4vw;
        min-width:100vw;
        transition:padding-top 0.1s ease-in-out;
        }

      .textplace.step1 { 
        padding-top:12vh;
        padding-left:4vw;
        min-width:100vw;
        }

      .textplace.step3 { 
        padding-top:27vh;
        padding-left:4vw;
        min-width:100vw;
        }

      #title {
        font-size:7vw; 
        font-weight: 500;
        }

      #title.larger{
        font-size:10vw; 
        font-weight: 500;
        }

      #details { 
        font-size:2.8vw;
        margin-top:5px;
        }

      .small { 
        font-size:14px
      }

      .hidden { 
        opacity:0;
        }

      #panel { 
        position:absolute;
        height:30vh;
        width:100vw;
        top:0vh;
        z-index:100;
        display:none;
        }

      badge-presentation { 
        z-index:10;
        width:100vw;
        height:94vh;
        top:6vh;
        position:fixed;
        background-color:var(--text-primary-color);
        overflow:scroll;
        }

        ico-scanner { 
          z-index:10;
          width:100vw;
          height:94vh;
          top:12vh;
          position:absolute;
          background-color:var(--light-primary-color);
          overflow:scroll;
          }

        /* end my-app */

        /* start ico-registration */

      .done { 
        opacity:0.5
        }

      ico-wizard div {
        color:var(--text-primary-color);
        background-color:var(--light-primary-color);
        }

      ico-wizard div[step0] { 
        width:100vw;
        height:25vh;
        }

      ico-wizard div[step1] {
        width:100vw;
        height:45vh;
        }

      ico-wizard div[step2] {
        width:100vw;
        height:80vh;
        }

      ico-wizard div[step3] { 
        width:100vw;
        height:40vh;
        }

      #pitchtext { 
        margin-top:40px;
        margin-left:20px; 
        height:10vh;
        }

      .large { 
        font-size:5vw; 
        font-weight: 600;
        }

      ico-wizard p {
        font-size: 16px; 
        margin:8px;
        }

      #psrofile { 
        background-image:url('/images/profile.jpg');
        background-size:100% 100%;
        width:100%;
        height:80vh;
        margin-bottom:20px;
        }

      paper-input { 
        @apply --custom-paper-input;
        }

      paper-input[disabled] {
        margin-bottom:140px;
        }

      #spacer { 
        flex:1;
         }

      #toolbar { 
        width:100vw;
        display:flex;
        justify-content:flex-end;
        align-items:center; 
       }

      #toolbar paper-button {
        margin-bottom: 30px; 
        margin-top: 30px;
        padding-left:20px;
        padding-right:20px;
        }

      #wizard { 
          position:absolute;
          display:flex;
          bottom:-50vh;
          height:50vh;
          flex-wrap:wrap;
          align-items:flex-end;
          width:100vw;
          background-color:none;
          transition:bottom 0.2s ease-in-out, height 0.2s ease-in-out
          }

        #wizard {bottom:1vh; background-color:var(--light-primary-color);}
        #wizard[step="0"] {height:55vh;}
        #wizard[step="1"] {height:72vh;}
        #wizard[step="2"] {height:85vh;}
        #wizard[step="3"] {height:55vh;}
        #wizard.toolbar   {bottom:65px;}

        /* end ico-registration */

        /* start ico-presentation */

 
        #grid { 
          overflow:scroll;
          }

        paper-icon-button { 
          margin-left:20px;
          color:var(--text-primary-color);
          }

        paper-button {
         @apply --primary-button;
          }

        paper-button[disabled] { 
          background: var(--disabled-color);
          }

        #videopanel { 
          position:absolute;
          display:flex;
          flex-direction:column;
          justify-content:space-around;
          height:90vh; 
          width:100vw;
          top:0vh;
          }

        /* #details { 
          transition:bottom 0.45s ease-in-out;
          position:relative;
          bottom:0vh;
          background-color:var(--light-primary-color);
          display:flex;
          align-items:center;
          justify-content:center;
          } */

        /* #details.shown {  
          position:relative;
          bottom:-35vh;
          height:30vh;
          }

        #details.hidden {  
          position:relative;
          bottom:-85vh;
          height:30vh;
          } */

        .info_details { 
          width:50vw;
          height:200px;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          }

        .info_username { 
          color:var(--text-primary-color);
          font-size:5vw;
        }

        .info_company { 
          color:var(--text-primary-color);
          font-size:16px;
          margin-top:12px;
          }

        /* .back_panel {
          position:absolute;
          left:20px;
        }  */

        .registration-back_panel {
          transition: bottom 0.45s ease-in-out;
          position:absolute;
          width:100vw;
          height:27vh;
          bottom:0vh;
          padding:20px;
        }

        .registration-back_panel.hidden {
          position:absolute;
          width:100vw;
          height:35vh;
          padding:20px;
          bottom: -35vh;
        }

        /* end ico presentation */

  </style>
</template>
</dom-module>
`;

const $_documentContainer = document.createElement('div');
$_documentContainer.setAttribute('style', 'display: none;');
$_documentContainer.innerHTML = htmlTemplate;
document.head.appendChild($_documentContainer);
