module.exports = ({ name, devices }) => {
  const today = new Date();
  return `
  <!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>PDF Result Template</title>
    <link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet'>
    <style>
    
      .invoice-box {
        max-width: 800px;
        margin: auto;
        padding:20px;
   
        font-size: 14px;
        line-height: 20px;
        font-family: "Roboto";
        color: #555;
      }
      .header {
   
        text-align: center;
        margin-bottom: 20px;
      }
      .margin-top {
        margin-top: 50px;
      }
      .justify-center {
        text-align: center;
      }
      .invoice-box table {
        width: 100%;
        line-height: inherit;
        text-align: left;
      }
      .invoice-box table td {
        padding: 5px;
        vertical-align: top;
      }
 
      .invoice-box table tr.top table td {
        padding-bottom: 10px;
      }
      .invoice-box table tr.top table td.title {
        font-size: 45px;
        line-height: 45px;
        color: #333;
      }
      .invoice-box table tr.information table td {
        padding-bottom: 20px;
      }
      .invoice-box table tr.heading td {
        background: #eee;
        border-bottom: 1px solid #ddd;
        font-weight: bold;
      }
      .invoice-box table tr.heading td:nth-child(2) {
        text-align: right;
      }
      .invoice-box table tr.item td:nth-child(2) {
        text-align: right;
      }
      .invoice-box table tr.footer-sign td {
        text-align: left;
      }
      .invoice-box table tr.details td {
        padding-bottom: 20px;
      }
      .invoice-box table tr.item td {
        border-bottom: 1px solid #eee;
      }
      .invoice-box table tr.item.last td {
        border-bottom: none;
      }
      .invoice-box table tr.total td:nth-child(2) {
        border-top: 2px solid #eee;
        font-weight: bold;
      }
    
      @media only screen and (max-width: 600px) {
        .invoice-box table tr.top table td {
          width: 100%;
          display: block;
          text-align: center;
        }
        .invoice-box table tr.information table td {
          width: 100%;
          display: block;
          text-align: center;
        }
      }
    </style>
  </head>
  <body>
    <div class="invoice-box">
      <div class="header">
        <h1>Hardware Acquisition Form</h1>
      </div>
      <table cellpadding="0" cellspacing="0">
        <tr class="top">
          <td colspan="2">
            <table>
            
              <tr>
                <td>
                  Date:
                  <u>${`${today.getDate()}/${
                    today.getMonth() + 1
                  }/${today.getFullYear()}`}</u>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr class="information">
          <td colspan="2">
            <table >
              <tr>
                <td>Asset(s) to be checked out:</td>
              </tr>
            </table>
          </td>
        </tr>
        
        <tr class="heading">
          <td>Device Name</td>
          <td>Serial Number</td>
        </tr>
        <script>
            // Devices data passed dynamically
            var devicesData = ${JSON.stringify(devices)};
          
            for (var i = 0; i < devicesData.length; i++) {
              var device = devicesData[i];
              var serialNumbers = device.serialNumbers.join(", ");
          
              document.write(
                '<tr class="item">' +
                '<td>' + device.name + '</td>' +
                '<td>' + serialNumbers + '</td>' +
                '</tr>'
              );
            }
          </script>
          
      </table>
      <br />
      <p>
        I, <b>${name}</b>, acknowledge that I am responsible for the above
        listed assets and that i have received them in good condition. I
        understand that I will be held accountable for any damages or loss
        incurred while these asasets are under my care.
      </p>

      <p>
        I agree to use these assets only for the purposes outlined by my
        employer and to return them in the same condition in which they were
        received. I will also ensure that they are stored in a secure and safe
        location to precent theft or damage.
      </p>

      <p>
        I understand that failure to comply with the terms of this agreement may
        result in disciplinary action or penalty, in accordance with the
        company's policies.
      </p>

      <p>
        I have read and understood the term of this Hardware acquisition and
        agree to abide by them.
      </p>
      <br/>
      <table>
        <tr class="footer-sign">
          <td>Recievied By:</td>
          <td>Approved By:</td>
          <td>Verified By:</td>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
          </tr>
     
          <tr>
            <td>___________________</td>
            <td>___________________</td>
            <td>___________________</td>
          </tr>
          <tr>
            <td>Name:</td>
            <td>Name:</td>
            <td>Name:</td>
          </tr>
          <tr>
            <td>Department:</td>
            <td>Department:</td>
            <td>Department:</td>
          </tr>
        
      </table>
    </div>
  </body>
</html>

    `;
};
