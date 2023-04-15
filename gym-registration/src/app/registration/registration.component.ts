import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';

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

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private toastrService: ToastrService
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
    })
  }

  submit() {
    this.apiService.postRegistration(this.registerForm.value).subscribe(res => {
      this.toastrService.success('Success', 'Enquiry Added');
      this.registerForm.reset();
    })
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

}
