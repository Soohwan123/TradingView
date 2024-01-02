package com.info5059.casestudy.purchaseorder;
import com.info5059.casestudy.pdfexample.Generator;
import com.info5059.casestudy.product.Product;
import com.info5059.casestudy.product.ProductRepository;
import com.info5059.casestudy.product.QRCodeGenerator;
import com.info5059.casestudy.vendor.Vendor;
import com.info5059.casestudy.vendor.VendorRepository;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.HorizontalAlignment;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;

import org.springframework.web.servlet.view.document.AbstractPdfView;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.net.URL;
import java.text.DateFormat;
import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Formatter;
import java.util.Locale;
import java.util.Optional;
import java.util.logging.Level;
import java.util.logging.Logger;
/**
* PurchaseOrderPDFGenerator - a class for creating dynamic expense PurchaseOrder output in
* PDF format using the iText 7 library
*
* @author Evan
*/
public abstract class PurchaseOrderPDFGenerator extends AbstractPdfView {
    public static ByteArrayInputStream generateReport(String poid, PurchaseOrderRepository pOrderRepository,
        VendorRepository vendorRepository, ProductRepository productRepository) throws IOException {

        PurchaseOrder purchaseOrder = new PurchaseOrder();
        Vendor vendor = new Vendor();

        URL imageUrl = Generator.class.getResource("/static/images/logoimg.png");
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);

        // Initialize PDF document to be written to a stream not a file
        PdfDocument pdf = new PdfDocument(writer);

        // Document is the main object
        Document document = new Document(pdf);
        PdfFont font = PdfFontFactory.createFont(StandardFonts.HELVETICA);

        // add the image to the document
        PageSize pg = PageSize.A4;
        Image img = new Image(ImageDataFactory.create(imageUrl)).scaleAbsolute(120, 120)
            .setFixedPosition(30, pg.getHeight() - 120 - 20); // Add a 20-point margin at the top
        document.add(img);

        // now let's add a big heading
        document.add(new Paragraph("\n\n"));
        Locale locale = Locale.of("en", "US");
        NumberFormat formatter = NumberFormat.getCurrencyInstance(locale);

        BigDecimal subtotal = new BigDecimal(0.0);
        BigDecimal tax = new BigDecimal(0.0);
        BigDecimal pototal = new BigDecimal(0.0);

        try {
            document.add(new Paragraph("\n"));
            Optional<PurchaseOrder> poOption = pOrderRepository.findById(Long.parseLong(poid));

            if (poOption.isPresent()) {
                purchaseOrder = poOption.get();
            }
            
            document.add(new Paragraph("Purchase Order").setFont(font).setFontSize(18).setBold()
                .setFont(font)
                .setFontSize(18)
                .setBold()
                .setTextAlignment(TextAlignment.RIGHT)
                .setMarginRight(100) // Adjust the right margin as needed
                .setMarginTop(-10));

            // then a smaller heading
            document.add(new Paragraph("#:" + poid)
                .setFont(font)
                .setFontSize(16)
                .setBold()
                .setTextAlignment(TextAlignment.RIGHT)
                .setMarginRight(150) // Adjust the right margin as needed
                .setMarginTop(-10));

            document.add(new Paragraph("\n\n"));


            // add the vendor info for the order here
            Table vendorTable = new Table(2).setWidth(new UnitValue(UnitValue.PERCENT, 30))
                .setBorder(Border.NO_BORDER)
                .setHorizontalAlignment(HorizontalAlignment.LEFT);

            document.add(new Paragraph("\n\n"));

            Optional<Vendor> vendorOption = vendorRepository.findById(purchaseOrder.getVendorid());
            if (vendorOption.isPresent()) {
                vendor = vendorOption.get();
            }

            Cell vdCell = new Cell().add(new Paragraph("Vendor: ")
                .setFont(font)
                .setFontSize(12)
                .setBold())
                .setTextAlignment(TextAlignment.CENTER)
                .setBorder(Border.NO_BORDER);
            vendorTable.addCell(vdCell);
            vdCell = new Cell().add(new Paragraph(vendor.getName())
                .setFont(font)
                .setFontSize(12)
                .setBold())
                .setTextAlignment(TextAlignment.LEFT)
                .setBorder(Border.NO_BORDER);
            vendorTable.addCell(vdCell);
            vdCell = new Cell().add(new Paragraph()
                .setFont(font)
                .setFontSize(12)
                .setBold())
                .setTextAlignment(TextAlignment.CENTER)
                .setBorder(Border.NO_BORDER);
            vendorTable.addCell(vdCell);
            vdCell = new Cell().add(new Paragraph(vendor.getAddress1())
                .setFont(font)
                .setFontSize(12)
                .setBold())
                .setTextAlignment(TextAlignment.LEFT)
                .setBorder(Border.NO_BORDER);
            vendorTable.addCell(vdCell);
            vdCell = new Cell().add(new Paragraph()
                .setFont(font)
                .setFontSize(12)
                .setBold())
                .setTextAlignment(TextAlignment.CENTER)
                .setBorder(Border.NO_BORDER);
            vendorTable.addCell(vdCell);
            vdCell = new Cell().add(new Paragraph(vendor.getCity())
                .setFont(font)
                .setFontSize(12)
                .setBold())
                .setTextAlignment(TextAlignment.LEFT)
                .setBorder(Border.NO_BORDER);
            vendorTable.addCell(vdCell);
            vdCell = new Cell().add(new Paragraph()
                .setFont(font)
                .setFontSize(12)
                .setBold())
                .setTextAlignment(TextAlignment.CENTER)
                .setBorder(Border.NO_BORDER);
            vendorTable.addCell(vdCell);
            vdCell = new Cell().add(new Paragraph(vendor.getProvince())
                .setFont(font)
                .setFontSize(12)
                .setBold())
                .setTextAlignment(TextAlignment.LEFT)
                .setBorder(Border.NO_BORDER);
            vendorTable.addCell(vdCell);
            vdCell = new Cell().add(new Paragraph()
                .setFont(font)
                .setFontSize(12)
                .setBold())
                .setTextAlignment(TextAlignment.CENTER)
                .setBorder(Border.NO_BORDER);
            vendorTable.addCell(vdCell);
            vdCell = new Cell().add(new Paragraph(vendor.getEmail())
                .setFont(font)
                .setFontSize(12)
                .setBold())
                .setTextAlignment(TextAlignment.LEFT)
                .setBorder(Border.NO_BORDER);
            vendorTable.addCell(vdCell);

            document.add(vendorTable);

            
            document.add(new Paragraph("\n\n"));

            // now a 3 column table
            Table table = new Table(5);
            table.setWidth(new UnitValue(UnitValue.PERCENT, 100));

            // Unfortunately we must format each cell individually :(
            // table headings
            Cell cell = new Cell().add(new Paragraph("Product Code")
                .setFont(font)
                .setFontSize(12)
                .setBold())
                .setTextAlignment(TextAlignment.CENTER);
            table.addCell(cell);
            cell = new Cell().add(new Paragraph("Description")
                .setFont(font)
                .setFontSize(12)
                .setBold())
                .setTextAlignment(TextAlignment.CENTER);
            table.addCell(cell);
            cell = new Cell().add(new Paragraph("Qty Sold")
                .setFont(font)
                .setFontSize(12)
                .setBold())
                .setTextAlignment(TextAlignment.CENTER);
            table.addCell(cell);
            cell = new Cell().add(new Paragraph("Price")
                .setFont(font)
                .setFontSize(12)
                .setBold())
                .setTextAlignment(TextAlignment.CENTER);
            table.addCell(cell);
            cell = new Cell().add(new Paragraph("Ext. Price")
                .setFont(font)
                .setFontSize(12)
                .setBold())
                .setTextAlignment(TextAlignment.CENTER);
            table.addCell(cell);

            // dump out the line items
            for (PurchaseOrderLineitem line : purchaseOrder.getItems()) {
                Optional<Product> optx = productRepository.findById(line.getProductid());
                if ( optx.isPresent() ) {
                    Product product = optx.get();

                    cell = new Cell().add(new Paragraph(product.getId())
                        .setFont(font)
                        .setFontSize(12)
                        .setTextAlignment(TextAlignment.CENTER));
                        table.addCell(cell);
                    cell = new Cell().add(new Paragraph(product.getName())
                        .setFont(font)
                        .setFontSize(12)
                        .setTextAlignment(TextAlignment.CENTER));
                        table.addCell(cell);
                    cell = new Cell().add(new Paragraph(Integer.toString(line.getQty()))
                        .setFont(font)
                        .setFontSize(12)
                        .setTextAlignment(TextAlignment.RIGHT));
                        table.addCell(cell);
                    cell = new Cell().add(new Paragraph(product.getCostprice().toString())
                        .setFont(font)
                        .setFontSize(12)
                        .setTextAlignment(TextAlignment.RIGHT));
                        table.addCell(cell);
                    cell = new Cell().add(new Paragraph(line.getPrice().toString())
                        .setFont(font)
                        .setFontSize(12)
                        .setTextAlignment(TextAlignment.RIGHT));
                        table.addCell(cell);
                    subtotal = subtotal.add(line.getPrice(), new MathContext(8, RoundingMode.UP));
                }
            }
            BigDecimal taxPercent = new BigDecimal("0.15");
            tax = subtotal.multiply(taxPercent);
            pototal = subtotal.add(tax);

            // puchaseorder total
            cell = new Cell(1, 4).add(new Paragraph("Sub Total:"))
                .setBorder(Border.NO_BORDER)
                .setTextAlignment(TextAlignment.RIGHT);
            table.addCell(cell);
            cell = new Cell().add(new Paragraph(formatter.format(subtotal)))
                .setTextAlignment(TextAlignment.RIGHT)
                .setBackgroundColor(ColorConstants.WHITE);
            table.addCell(cell);
            cell = new Cell(1, 4).add(new Paragraph("Tax:"))
                .setBorder(Border.NO_BORDER)
                .setTextAlignment(TextAlignment.RIGHT);
            table.addCell(cell);
            cell = new Cell().add(new Paragraph(formatter.format(tax)))
                .setTextAlignment(TextAlignment.RIGHT)
                .setBackgroundColor(ColorConstants.WHITE);
            table.addCell(cell);
            cell = new Cell(1, 4).add(new Paragraph("PO Total:"))
                .setBorder(Border.NO_BORDER)
                .setTextAlignment(TextAlignment.RIGHT);
            table.addCell(cell);
            cell = new Cell().add(new Paragraph(formatter.format(pototal)))
                .setTextAlignment(TextAlignment.RIGHT)
                .setBackgroundColor(ColorConstants.YELLOW);
            table.addCell(cell);
            document.add(table);

            document.add(new Paragraph("\n\n"));

            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd h:mm a");
            document.add(new Paragraph(dateFormatter.format(purchaseOrder.getPodate()))
                .setTextAlignment(TextAlignment.CENTER));

            float pageWidth = pg.getWidth();
            NumberFormat numFormatter = NumberFormat.getCurrencyInstance(locale);
            Image qrcode = addSummaryQRCode(vendor, purchaseOrder, numFormatter);
            qrcode.scaleAbsolute(100, 100)
                        .setFixedPosition(pageWidth - 130, 20); // Add a 20-point margin at the right and 20-point margin at the top
            document.add(qrcode);

            document.close();
        } catch (Exception ex) {
            Logger.getLogger(Generator.class.getName()).log(Level.SEVERE, null, ex);
        }
        
        // finally send stream back to the controller
        return new ByteArrayInputStream(baos.toByteArray());
    }

    public static Image addSummaryQRCode(Vendor ven, PurchaseOrder po, NumberFormat formatter){
        QRCodeGenerator qrGenerator = new QRCodeGenerator();
         // Use DateTimeFormatter for formatting LocalDateTime
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd hh:mm:ss a");

        // Check if po.getPodate() is not null before formatting
        String formattedDate = po.getPodate() != null ? po.getPodate().format(dateFormatter) : "N/A";
        String qrTxt = "Summary for Purchase Order:" + po.getId() + "\nDate:"
                                                     + formattedDate + "\nVendor:"
                                                     + ven.getName()
                                                     + "\nTotal:" + formatter.format(po.getAmount());
        byte[] qrcodebin = qrGenerator.generateQRCode(qrTxt);       
        return new Image(ImageDataFactory.create(qrcodebin)).scaleAbsolute(100, 100).setFixedPosition(460,60);
    }
}