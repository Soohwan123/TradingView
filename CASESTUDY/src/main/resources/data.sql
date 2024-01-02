-- add initial vendor test data
INSERT INTO Vendor (Address1,City,Province,PostalCode,Phone,Type,Name,Email)VALUES ('123 Maple St','London','On', 'N1N-1N1','(555)555-5555','Trusted','ABC Supply Co.','abc@supply.com');
INSERT INTO Vendor (Address1,City,Province,PostalCode,Phone,Type,Name,Email) VALUES ('543 Sycamore Ave','Toronto','On', 'N1P-1N1','(999)555-5555','Trusted','Big Bills Depot','bb@depot.com');
INSERT INTO Vendor (Address1,City,Province,PostalCode,Phone,Type,Name,Email) VALUES ('922 Oak St','London','On', 'N1N-1N1','(555)555-5599','Untrusted','Shady Sams','ss@underthetable.com');
INSERT INTO Vendor (Address1,City,Province,PostalCode,Phone,Type,Name,Email) VALUES ('565 Talbot St','London','On', 'N6A-2N1','(555)578-9999','Untrusted','Soohwan Kim','sh@vendor.com');


-- add some products to seed the table
INSERT INTO Product (Id,VendorId,Name,CostPrice,Msrp,Rop,Eoq,Qoh,Qoo,Qrcode,QrcodeTxt)
    VALUES ('1X45',1,'Vending Machine', 1200, 1500 , 4, 11, 11, 0, null, null);
INSERT INTO Product (Id,VendorId,Name,CostPrice,Msrp,Rop,Eoq,Qoh,Qoo,Qrcode,QrcodeTxt)
    VALUES ('2X45',1,'Printer', 320, 410 , 3, 15, 10, 1, null, null);
INSERT INTO Product (Id,VendorId,Name,CostPrice,Msrp,Rop,Eoq,Qoh,Qoo,Qrcode,QrcodeTxt)
    VALUES ('3X45',2,'Table', 120, 150 , 5, 5, 5, 2, null, null);
INSERT INTO Product (Id,VendorId,Name,CostPrice,Msrp,Rop,Eoq,Qoh,Qoo,Qrcode,QrcodeTxt)
    VALUES ('4X45',2,'Chair', 32, 37 , 6, 7, 6, 1, null, null);
INSERT INTO Product (Id,VendorId,Name,CostPrice,Msrp,Rop,Eoq,Qoh,Qoo,Qrcode,QrcodeTxt)
    VALUES ('5X45',3,'Vape', 100, 115 , 6, 6, 5, 0, null, null);
INSERT INTO Product (Id,VendorId,Name,CostPrice,Msrp,Rop,Eoq,Qoh,Qoo,Qrcode,QrcodeTxt)
    VALUES ('6X45',3,'Nail Clipper', 30, 35 , 2,5,5, 1, null, null);
INSERT INTO Product (Id,VendorId,Name,CostPrice,Msrp,Rop,Eoq,Qoh,Qoo,Qrcode,QrcodeTxt)
    VALUES ('7X45',4,'Keyboard', 50, 67 , 6, 6, 5, 0, null, null);
INSERT INTO Product (Id,VendorId,Name,CostPrice,Msrp,Rop,Eoq,Qoh,Qoo,Qrcode,QrcodeTxt)
    VALUES ('8X45',4,'Mouse', 35, 50 , 2,5,5, 1, null, null);
INSERT INTO Product (Id,VendorId,Name,CostPrice,Msrp,Rop,Eoq,Qoh,Qoo,Qrcode,QrcodeTxt)
    VALUES ('9X45',4,'Monitor', 299, 310, 2,5,5, 1, null, null);
INSERT INTO Product (Id,VendorId,Name,CostPrice,Msrp,Rop,Eoq,Qoh,Qoo,Qrcode,QrcodeTxt)
    VALUES ('15X45',4,'Headset', 50, 67 , 6, 6, 5, 0, null, null);
INSERT INTO Product (Id,VendorId,Name,CostPrice,Msrp,Rop,Eoq,Qoh,Qoo,Qrcode,QrcodeTxt)
    VALUES ('14X45',4,'Coke', 35, 50 , 2,5,5, 1, null, null);
INSERT INTO Product (Id,VendorId,Name,CostPrice,Msrp,Rop,Eoq,Qoh,Qoo,Qrcode,QrcodeTxt)
    VALUES ('13X45',4,'Vitamin', 299, 310, 2,5,5, 1, null, null);