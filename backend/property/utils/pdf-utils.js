
const puppeter = require('puppeteer');
const handlebars = require('handlebars');

const fs = require('fs');
const path = require('path');

var generatepdf = function (template, data) {
    handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    });
    handlebars.registerHelper('notNull', function (arg1, arg2, options) {
        return (arg1 != arg2) ? options.fn(this) : options.inverse(this);
    });

    handlebars.registerHelper('checkIfGreater', function (arg1, arg2, options) {
        return (arg1 > arg2) ? options.fn(this) : options.inverse(this);
    });
    handlebars.registerHelper('checkIfLessOrEqual', function (arg1, arg2, options) {
        return (arg1 <= arg2) ? options.fn(this) : options.inverse(this);
    });

    handlebars.registerHelper("inc", function(value, options)
    {
        return parseInt(value) + 1;
    });
    var templatefile = fs.readFileSync(path.join(__dirname, '../pdftemplates/' + template + '.html'), 'utf8');
    var template = handlebars.compile(templatefile);
    if(data.round){
        data.round = data.round.replace(/Funding Round/gm,'Development Round');
    }
    var html = template(data);
    
    rcpt_no = data.queueNumber ? data.queueNumber : data.membershipNumber ? data.membershipNumber : data.daoID;
    var filename = 'receipt' + rcpt_no + '.pdf';

    var options = {

        displayHeaderFooter: false,
        margin:  'minimum',
        printBackground: true,
        format: 'letter',
        portrait: true,


    }

    return puppeterlaunch(options, filename, html)
        .then(function (result) {

            return result;
        })
        .catch(function (error) {
            throw error;
        })


}


async function puppeterlaunch(options, filename, html) {
    var isWin = process.platform === "win32";
    let config = {
        executablePath: '/usr/bin/google-chrome-beta',
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
    if(isWin){
        delete config["executablePath"];
    }
    const browser = await puppeter.launch(config);

    const page = await browser.newPage()

    await page.setContent(html, {
        waitUntil: ['domcontentloaded', 'networkidle0', 'load']
    })

    await page.evaluateHandle('document.fonts.ready');

    const pdf = await page.pdf(options)

    await browser.close()

    // preview pdf
    //savePDFToLocal(pdf);
    var jsonobject = {
        pdfcontent: pdf,
        filename: filename
    }
    return jsonobject;
}

const savePDFToLocal = function (data) {
    const blob = new Blob([data], { type: 'application/pdf' })
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = `your-file-name.pdf`
    link.click()
}


module.exports = { generatepdf };