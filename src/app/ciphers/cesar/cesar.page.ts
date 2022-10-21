import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-cesar',
  templateUrl: './cesar.page.html',
  styleUrls: ['./cesar.page.scss'],
})
export class CesarPage implements OnInit {
  public defaultAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  public encryptedMessage = '';
  public dummyMessage = 'Buen día, ¿usted cómo se encuentra? Este es un mensaje súper secreto. No se lo cuente a nadie.';

  // Form
  public cesarForm: FormGroup;

  // Condition number
  public conditionNum = 0;

  // Alphabet
  public alphabetLenght: number = this.defaultAlphabet.length;

  // Formated message in array form
  public formatedMsg = '';

  // Encrypted message
  public encryptedMsg = '';

  // Xm array
  public xm: number[] = [];

  // Ek array
  public ekPlain: number[] = [];
  public ekEncrypted: number[][] = [];

  constructor(
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    // Create form
    this.cesarForm = new FormGroup({
      aKey: new FormControl(null, Validators.required),
      bKey: new FormControl(null, Validators.required),
      numBlocks: new FormControl(2, Validators.required),
      textMessage: new FormControl(null, Validators.required),
      formatedMessage: new FormControl(this.encryptedMessage),
      encryptedMessage: new FormControl(this.encryptedMessage),
      alphabet: new FormControl(this.defaultAlphabet, Validators.required),
    });

    this.updateData();
  }

  useDummyMsg() {
    this.cesarForm.get('textMessage').setValue(this.dummyMessage);
  }

  calculate() {
    this.loadingCtrl
      .create({message: 'Please wait while Camilo makes some magic...'})
      .then((loadingElement) => {
        loadingElement.present();
        setTimeout(() => {
          loadingElement.dismiss();
          this.reset();
          this.formatStrIntoArray();
          this.calculateXm();
          this.calculateEk();
          this.encryptMsg();
        }, Math.random() * 2000);
      });
  }

  // Updates data
  updateData() {
    // Updates
    this.alphabetLenght = this.cesarForm.get('alphabet').value.length;
    this.conditionNum = Math.pow(this.alphabetLenght, this.cesarForm.get('numBlocks').value);
  }

  // Clears all arrays
  reset() {
    this.xm = [];
    this.ekPlain = [];
    this.ekEncrypted = [];
    this.encryptedMsg = '';
  }

  // Checks if entered number is an integer
  checkNumBlocks() {
    console.log('Checking if n is integer.');

    this.updateData();

    const value = this.cesarForm.get('numBlocks').value;
    if (value <= 0) {
      this.cesarForm.get('numBlocks').setValue(2);
      return;
    }
    if (value % 1 !== 0) {
      this.cesarForm.get('numBlocks').setValue(Math.floor(value));
      this.alertCtrl.create({
        header: 'Input Error on n Number!',
        message: 'The entered number is not an integer! Your entered number will be rounded to the nearest lower integer.',
        buttons: ['Okay'],
      }).then((alertElement) => {
        alertElement.present();
      });
    }
    this.checkBKey();
    this.checkAKey();
  }

  // Checks if b key condition is met.
  checkBKey() {
    console.log('Checking if b key is valid.');

    // Gets the alphabet length
    this.alphabetLenght = this.cesarForm.get('alphabet').value.length;

    const bValue = this.cesarForm.get('bKey').value;
    if (!bValue) {
      return;
    }
    const sqNValue = Math.pow(this.alphabetLenght, this.cesarForm.get('numBlocks').value);
    if (bValue > sqNValue || bValue <= 0) {
      this.cesarForm.get('bKey').setValue(sqNValue);
      this.alertCtrl.create({
        header: 'Input Error on b Key!',
        message: `The entered number does not meet the condition!
          Your entered number will be set as the highest posible number available.`,
        buttons: ['Okay'],
      }).then((alertElement) => {
        alertElement.present();
      });
    }
  }

  // Checks if a key condition is met.
  checkAKey() {
    console.log('Checking if a key is valid.');
    const aValue = this.cesarForm.get('aKey').value;
    if (!aValue) {
      return;
    }
    const sqNValue = Math.pow(this.alphabetLenght, this.cesarForm.get('numBlocks').value);
    let x = aValue;
    let y = sqNValue;
    // Computes the Greatest Common Divisor between x and y.
    while(y) {
      const aux = y;
      y = x % y;
      x = aux;
    }
    if (x !== 1) {
      this.cesarForm.get('aKey').setValue(1);
      this.alertCtrl.create({
        header: 'Input Error on a Key!',
        message: `The entered number is not a Prime Quotient for ${sqNValue}!
          Your entered number will be set as 1.`,
        buttons: ['Okay'],
      }).then((alertElement) => {
        alertElement.present();
      });
    }
  }

  // Calculates the num of Xm needed
  amountXM(): number {
    return Math.ceil(
      this.formatedMsg.length / this.cesarForm.get('numBlocks').value
      );
  };

  // Format input string into array
  formatStrIntoArray() {
    // Quita los espacios, acentos, signos de puntuación y pasa todo a mayúsculas.
    let array = this.cesarForm.get('textMessage')
      .value.toUpperCase().replace(/\s/g, '')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()!¡¿?]/g, '');

    // Calcula el número de letras necesario para completar el bloque.
    if (array.length % this.cesarForm.get('numBlocks').value !== 0) {
      const fit = this.cesarForm.get('numBlocks').value - array.length%this.cesarForm.get('numBlocks').value;
      const char = array.charAt(array.length-1);

      for (let i = 0; i < fit; i++) {
        array += char;
      }
    }

    this.formatedMsg = array;
    this.cesarForm.get('formatedMessage').setValue(array);
  }

  // Fórmula que calcula cada xm y lo guarda en un array.
  calculateXm() {
    const n = this.cesarForm.get('numBlocks').value;

    for (let i = 0; i < this.amountXM(); i++) {
      this.xm[i] = 0;
      for (let j = 0; j <= n - 1 ; j++) {
        // Busca el valor númerico correspondiente a cada letra en el alfabeto.
        const letterValue = this.cesarForm.get('alphabet').value.indexOf(
          this.formatedMsg.charAt((i*n)+j)
        );
        // Hace la operación dentro de la sumatoria.
        this.xm[i] += Math.pow(this.alphabetLenght, (n-1)-j) * letterValue;
      }
      // console.log(`Xm[${i}] = ${this.xm[i]}`);
    }
    console.log(`Xm[i] = ${this.xm}`);
  }

  // Cálculo de los ek no cifrados.
  calculateEk() {
    const a = parseFloat(this.cesarForm.get('aKey').value);
    const b = parseFloat(this.cesarForm.get('bKey').value);
    const n = parseFloat(this.cesarForm.get('numBlocks').value);

    // Whole numbers
    for (const [i, xm] of this.xm.entries()) {
      this.ekPlain[i] = ((a*xm) + b) % Math.pow(this.alphabetLenght, n);
      // console.log(`ek_p[${i}] = ${this.ekPlain[i]}`);
    }
    console.log(`ekP[i] = ${this.ekPlain}`);

    // Corresponding letters based on num of blocks
    for (const [i, ekP] of this.ekPlain.entries()) {
      this.ekEncrypted[i] = [];
      for (let j = 0; j <= n-1; j++) {
        this.ekEncrypted[i][j] = Math.floor(
          (ekP % Math.pow(this.alphabetLenght, n-j)) / Math.pow(this.alphabetLenght, n-1-j)
        );
        // console.log(`ek[${i}][${j}] = ${this.ekEncrypted[i][j]}`);
      }
      // console.log(`ek[${i}] = ${this.ekEncrypted[i]}`);
    }
    console.table(this.ekEncrypted);
  }

  // Create the encrypted message
  encryptMsg() {
    for (const i of this.ekEncrypted.keys()) {
      for (const num of this.ekEncrypted[i]) {
        this.encryptedMsg +=  this.cesarForm.get('alphabet').value.charAt(num);
      }
    }
    this.cesarForm.get('encryptedMessage').setValue(this.encryptedMsg);
  }
}

