import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CVService} from '../../services/cv-service';
import { CV} from '../../models/cv-model';
import { NavbarComponent} from '../navbar/navbar-component';

@Component({
  selector: 'app-edit-cv',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './edit-cv-component.html',
  styleUrls: ['./edit-cv-component.css']
})
export class EditCvComponent implements OnInit {
  cvForm!: FormGroup;
  selectedTemplate: string = '';
  isEditMode: boolean = false;
  cvId?: string;
  activeSection: string = 'personal';
  isSaving: boolean = false;
  saveError: string = '';

  languageLevels = ['Basic', 'Intermediate', 'Advanced', 'Native'];

  sections = [
    { id: 'personal', name: 'Dane osobowe', icon: 'pi-user' },
    { id: 'experience', name: 'Doświadczenie', icon: 'pi-briefcase' },
    { id: 'education', name: 'Edukacja', icon: 'pi-book' },
    { id: 'skills', name: 'Umiejętności', icon: 'pi-cog' },
    { id: 'languages', name: 'Języki', icon: 'pi-globe' }
  ];

  constructor(
    private fb: FormBuilder,
    private cvService: CVService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.route.params.subscribe(params => {
      const id = params['id'] as string;

      if (id) {
        this.isEditMode = true;
        this.cvId = id;
        this.loadCV(id);
      } else {
        this.selectedTemplate = this.cvService.getSelectedTemplate();
        if (!this.selectedTemplate) {
          this.router.navigate(['/create-cv']);
        }
      }
    });
  }

  initForm(): void {
    this.cvForm = this.fb.group({
      templateType: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: [''],
      profilePicture: [''],
      summary: [''],
      experiences: this.fb.array([]),
      educations: this.fb.array([]),
      skills: this.fb.array([]),
      languages: this.fb.array([])
    });
  }

  loadCV(id: string): void {
    this.cvService.getCVById(id).subscribe({
      next: (cv) => {
        this.selectedTemplate = cv.templateType;
        this.patchFormWithCV(cv);
      },
      error: (err) => {
        console.error('Error loading CV:', err);
        this.saveError = 'Nie udało się załadować CV';
      }
    });
  }

  patchFormWithCV(cv: CV): void {
    this.cvForm.patchValue({
      templateType: cv.templateType,
      firstName: cv.firstName,
      lastName: cv.lastName,
      email: cv.email,
      phone: cv.phone,
      address: cv.address,
      profilePicture: cv.profilePicture,
      summary: cv.summary
    });

    cv.experiences.forEach(exp => this.addExperience(exp));
    cv.educations.forEach(edu => this.addEducation(edu));
    cv.skills.forEach(skill => this.addSkill(skill));
    cv.languages.forEach(lang => this.addLanguage(lang));
  }

  get experiences(): FormArray {
    return this.cvForm.get('experiences') as FormArray;
  }

  get educations(): FormArray {
    return this.cvForm.get('educations') as FormArray;
  }

  get skills(): FormArray {
    return this.cvForm.get('skills') as FormArray;
  }

  get languages(): FormArray {
    return this.cvForm.get('languages') as FormArray;
  }

  createExperienceGroup(data?: any): FormGroup {
    return this.fb.group({
      position: [data?.position || '', Validators.required],
      company: [data?.company || '', Validators.required],
      location: [data?.location || ''],
      startDate: [data?.startDate || '', Validators.required],
      endDate: [data?.endDate || ''],
      description: [data?.description || '']
    });
  }

  addExperience(data?: any): void {
    this.experiences.push(this.createExperienceGroup(data));
  }

  removeExperience(index: number): void {
    this.experiences.removeAt(index);
  }

  createEducationGroup(data?: any): FormGroup {
    return this.fb.group({
      degree: [data?.degree || '', Validators.required],
      institution: [data?.institution || '', Validators.required],
      location: [data?.location || ''],
      startDate: [data?.startDate || '', Validators.required],
      endDate: [data?.endDate || ''],
      description: [data?.description || '']
    });
  }

  addEducation(data?: any): void {
    this.educations.push(this.createEducationGroup(data));
  }

  removeEducation(index: number): void {
    this.educations.removeAt(index);
  }

  createSkillControl(skill?: string): FormGroup {
    return this.fb.group({
      name: [skill || '', Validators.required]
    });
  }

  addSkill(skill?: string): void {
    this.skills.push(this.createSkillControl(skill));
  }

  removeSkill(index: number): void {
    this.skills.removeAt(index);
  }

  createLanguageGroup(data?: any): FormGroup {
    return this.fb.group({
      name: [data?.name || '', Validators.required],
      level: [data?.level || 'Basic', Validators.required]
    });
  }

  addLanguage(data?: any): void {
    this.languages.push(this.createLanguageGroup(data));
  }

  removeLanguage(index: number): void {
    this.languages.removeAt(index);
  }

  setActiveSection(section: string): void {
    this.activeSection = section;
  }

  onSubmit(): void {
    if (this.cvForm.valid) {
      this.isSaving = true;
      this.saveError = '';

      const cvData: CV = {
        ...this.cvForm.value,
        templateType: this.selectedTemplate,
        skills: this.skills.value.map((s: any) => s.name)
      };


      if (this.isEditMode && this.cvId) {
        this.cvService.updateCV(this.cvId, cvData).subscribe({
          next: (response) => {
            this.isSaving = false;
            this.router.navigate(['/preview-cv', response.id]);
          },
          error: (error) => {
            this.isSaving = false;
            this.saveError = 'Nie udało się zaktualizować CV';
          }
        });
      } else {
        this.cvService.createCV(cvData).subscribe({
          next: (response) => {
            this.isSaving = false;
            this.router.navigate(['/preview-cv', response.id]);
          },
          error: (error) => {
            console.error('❌ Error creating CV', error);
            this.isSaving = false;
            this.saveError = 'Nie udało się utworzyć CV';
          }
        });
      }
    } else {
      this.markFormGroupTouched(this.cvForm);
      ;
    }
  }

  markFormGroupTouched(formGroup: FormGroup | FormArray): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/create-cv']);
  }
}
