import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-pdf-edit',
  templateUrl: './pdf-edit.component.html',
  styleUrls: ['./pdf-edit.component.scss']
})
export class PdfEditComponent {
  @ViewChild('contentToConvert', { static: false }) content!: ElementRef;

  submitClick: boolean = false;

  constructor() { }

  updatePdfForm = new FormGroup({
    txnRefId: new FormControl('', Validators.required),
    refId: new FormControl('', Validators.required),
    billNo: new FormControl('', Validators.required),
    mobileNo: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    billerName: new FormControl('', Validators.required),
    consumerNo: new FormControl('', Validators.required),
    customerName: new FormControl('', Validators.required),
    dateOfPayment: new FormControl('', Validators.required),
    amount: new FormControl('', Validators.required),
  });

  ngOnInit() {
    this.generate();
  }

  downloadPDF() {
    const content = this.content.nativeElement;

    html2canvas(content, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = (pdf as any).getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(this.updatePdfForm.value.consumerNo +  '.pdf');
    });
  }

  generate() {
    this.updatePdfForm.patchValue(
      {
        txnRefId: this.generateTxnRefId(),
        refId: this.generateRefId() + ' ' + Math.floor(10 ** 10 + Math.random() * 9 * 10 ** 10).toString(),
        billNo: Math.floor(10 ** 8 + Math.random() * 9 * 10 ** 8).toString(),
        mobileNo: Math.floor(10 ** 3 + Math.random() * 9 * 10 ** 3).toString(),
        email: this.generateEmail()
      }
    );
  }

  generateRefId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomId = Array.from({ length: 20 }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join('');

    return randomId;
  }

  generateTxnRefId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const digits = '0123456789';

    let result = '';
    for (let i = 0; i < 6; i++) {
      result += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    for (let i = 0; i < 10; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  generateEmail() {
    const chars = 'mnwxyz0123456789';
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const length = Math.floor(6 + Math.random() * 15);
    const firstChar = letters.charAt(Math.floor(Math.random() * letters.length));
    const middleChars = 'x'.repeat(length - 2);  // Subtract 2 for first and last
    const lastChar = chars.charAt(Math.floor(Math.random() * chars.length));

    return firstChar + middleChars + lastChar;
  }

}