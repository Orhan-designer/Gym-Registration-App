import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user.model';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  public packages: string[] = ['Monthly', 'Quarterly', 'Yearly'];
  public genders: string[] = ['Male', 'Female'];
  public importantList: string[] = [
    'Toxic Fat reduction',
    'Energy and Endurance',
    'Building Lean Muscle',
    'Healthier Digestive System',
    'Sugar Craving Body',
    'Fitness'
  ];
  public registerForm!: FormGroup;
  public userIdToUpdate!: number;
  public isUpdateActivate: boolean = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private toastrService: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required]],
      weight: ['', [Validators.required]],
      height: [''],
      bmi: [''],
      bmiResult: [''],
      gender: [''],
      requireTrainer: [''],
      package: [''],
      important: ['', [Validators.required]],
      gymBefore: [''],
      enquiryDate: ['', [Validators.required]],
    });

    this.registerForm.controls['height'].valueChanges.subscribe(res => {
      this.calculateBmi(res);
    });

    //Получаем пользователя по id, при переходе на страницу редактирования, отображаем предыдущие данные о нем
    this.activatedRoute.params.subscribe(val => {
      //Приходит undefined, т.к id юзера изначально не найдено на странице http://localhost:4200/register
      this.userIdToUpdate = val['id'];

      if (this.userIdToUpdate !== undefined) {
        this.apiService.getRegisteredUserById(this.userIdToUpdate).subscribe(res => {
          this.isUpdateActivate = true;
          this.fillFormToUpdate(res);
        });
      }
    })
  }

  //Регистрируем пользователя и обноваляем поля
  submit() {
    this.apiService.postRegistration(this.registerForm.value).subscribe(res => {
      this.toastrService.success('Success', 'Enquiry Added');
      this.registerForm.reset();
    });
  }

  //Обновление пользователя
  update() {
    this.apiService.updateRegisteredUser(this.registerForm.value, this.userIdToUpdate).subscribe(res => {
      this.spinner.show();

      setTimeout(() => {
        this.toastrService.success('Success', 'Enquiry update');
        this.registerForm.reset();
        this.router.navigate(['list']);
        this.spinner.hide();
      }, 1500);
    });
  }

  calculateBmi(heightValue: number) {
    const weight = this.registerForm.value.height;
    const height = heightValue;
    const bmi = weight / (height * height);
    this.registerForm.controls['bmi'].patchValue(bmi);

    switch (true) {
      case bmi < 18.5:
        this.registerForm.controls['bmiResult'].patchValue('Underweight');
        break;

      case (bmi >= 18.5 && bmi < 25):
        this.registerForm.controls['bmiResult'].patchValue('Normal weight');
        break;

      case (bmi >= 25 && bmi < 30):
        this.registerForm.controls['bmiResult'].patchValue('Overweight');
        break;

      default:
        this.registerForm.controls['bmiResult'].patchValue('Obese');
        break;
    }
  }

  //Метод обновления данных о пользователе
  fillFormToUpdate(user: User) {
    this.registerForm.setValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
      weight: user.weight,
      height: user.height,
      bmi: user.bmi,
      bmiResult: user.bmiResult,
      gender: user.gender,
      requireTrainer: user.requireTrainer,
      package: user.package,
      important: user.important,
      gymBefore: user.gymBefore,
      enquiryDate: user.enquiryDate
    })
  }
}
