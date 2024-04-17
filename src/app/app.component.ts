import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  dateForm: FormGroup;
  minDateInicial: Date = new Date();
  minDate: Date = new Date();
  maxEndDate!: Date;
  timesCopy: any[] = [
    '00:00',
    '00:30',
    '01:00',
    '01:30',
    '02:00',
    '02:30',
    '03:00',
    '03:30',
    '04:00',
    '04:30',
    '05:00',
    '05:30',
    '06:00',
    '06:30',
    '07:00',
    '07:30',
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30',
    '19:00',
    '19:30',
    '20:00',
    '20:30',
    '21:00',
    '21:30',
    '22:00',
    '22:30',
    '23:00',
    '23:30',
  ];
  times: any[] = [
    '00:00',
    '00:30',
    '01:00',
    '01:30',
    '02:00',
    '02:30',
    '03:00',
    '03:30',
    '04:00',
    '04:30',
    '05:00',
    '05:30',
    '06:00',
    '06:30',
    '07:00',
    '07:30',
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30',
    '19:00',
    '19:30',
    '20:00',
    '20:30',
    '21:00',
    '21:30',
    '22:00',
    '22:30',
    '23:00',
    '23:30',
  ];

  totalTimes = 48;
  endTimeOptions: string[] = [];

  constructor(private fb: FormBuilder) {
    this.dateForm = this.fb.group({
      startDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endDate: ['', Validators.required],
      endTime: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.dateForm.get('startDate')!.valueChanges.subscribe((value: any) => {
      if (value) {
        this.dateForm.patchValue({
          startTime: '',
          endDate: '',
          endTime: '',
        });
        this.updateEndStart(value);
        // this.updateEndDateLimits(value);
      }
    });

    this.dateForm.get('startTime')!.valueChanges.subscribe((value: any) => {
      if (value) {
        this.dateForm.patchValue({
          endDate: '',
          endTime: '',
        });
        let startDate = this.dateForm.value.startDate;
        const today = new Date(startDate);

        today.setHours(0, 0, 0, 0); // Asegurarse de que la fecha comienza al inicio del día.
        this.minDate = today;
        this.updateTimeEnd(value);
      }
    });

    this.dateForm.get('endDate')!.valueChanges.subscribe((value: any) => {
      if (value) {
        let startTime = this.dateForm.value.startTime;
        let endTime = this.dateForm.value.endTime;

        let startDate = new Date(this.dateForm.value.startDate);
        let endDate = new Date(value);
        let startTimeIndex = this.timesCopy.indexOf(startTime);

        const fourHoursLaterIndex = startTimeIndex + 8;
        this.endTimeOptions = [];

        if (!this.areDatesEqualByDay(startDate, endDate)) {
          let tamanio = fourHoursLaterIndex - this.totalTimes;
          for (tamanio; tamanio < this.totalTimes; tamanio++) {
            if (
              tamanio < startTimeIndex &&
              this.timesCopy[tamanio] !== undefined
            ) {
              this.endTimeOptions.push(this.timesCopy[tamanio]);
            }
          }
        } else {
          if (fourHoursLaterIndex > this.totalTimes) {
            // let currentDate = new Date();
            // currentDate.setDate(currentDate.getDate() + 1);
            // this.minDate = currentDate;
            let tamanio = fourHoursLaterIndex - this.totalTimes;
            for (tamanio; tamanio < this.totalTimes; tamanio++) {
              this.endTimeOptions.push(this.timesCopy[tamanio]);
            }
          } else {
            let tamanio = startTimeIndex + 8;
            for (tamanio; tamanio < this.totalTimes; tamanio++) {
              this.endTimeOptions.push(this.timesCopy[tamanio]);
            }
          }
        }
      }
    });
  }

  areDatesEqualByDay(date1: Date, date2: Date) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  updateEndStart(value: any) {
    if (this.isToday()) {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      let horaString;
      if (hours < 9 || (hours === 9 && minutes < 30)) {
        // Caso para horas antes de las 9:30 AM, asegurando el formato de dos dígitos para la hora
        if (minutes < 30) {
          horaString = `0${hours}:30`;
        } else {
          horaString = `0${hours + 1}:00`;
        }
      } else {
        // Caso para las 9:30 AM en adelante
        if (minutes < 30) {
          horaString = `${hours}:30`;
        } else if (hours === 23) {
          // Caso especial para manejar el cambio de día a medianoche
          horaString = `00:00`;
        } else {
          horaString = `${hours + 1}:00`;
        }
      }

      const startTimeIndex = this.timesCopy.indexOf(horaString);
      this.times = [];
      for (let i = startTimeIndex; i < this.totalTimes; i++) {
        this.times.push(this.timesCopy[i]);
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Asegurarse de que la fecha comienza al inicio del día.
      this.minDate = today;
      this.maxEndDate = new Date(today);
      this.maxEndDate.setDate(this.maxEndDate.getDate() + 1);
    } else {
      const today = new Date(value);

      today.setHours(0, 0, 0, 0); // Asegurarse de que la fecha comienza al inicio del día.
      this.minDate = today;
      this.maxEndDate = new Date(today);
      this.maxEndDate.setDate(this.maxEndDate.getDate() + 1);
      this.times = [];
      for (let i = 0; i < this.totalTimes; i++) {
        this.times.push(this.timesCopy[i]);
      }
    }
  }

  isTomorrow(dateToCheck: any) {
    dateToCheck = new Date(dateToCheck);
    const today = new Date(); // Fecha y hora actuales
    const tomorrow = new Date(); // Fecha y hora actuales
    tomorrow.setDate(tomorrow.getDate() + 1); // Incrementa el día en 1 para obtener 'mañana'

    // Ajusta ambos objetos Date para que comiencen a medianoche para una comparación justa
    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    dateToCheck.setHours(0, 0, 0, 0);

    // Compara la fecha a verificar con 'mañana'
    return dateToCheck.getTime() === tomorrow.getTime();
  }

  // private updateEndDateLimits(startDate: Date) {
  //   this.dateForm.get('endDate')!.enable();
  //   this.dateForm.patchValue({ endDate: null }); // Reset end date when start date changes

  //   const minEndDate = new Date(startDate); // Min is the same as start date
  //   const maxEndDate = new Date(startDate);
  //   maxEndDate.setDate(maxEndDate.getDate() + 1); // Max is the next day

  //   // this.minDate = minEndDate; // Set the minimum date to the start date
  //   this.maxEndDate = maxEndDate; // Set the maximum date to the next day
  // }

  updateTimeEnd(value: any) {
    let startTimeIndex = this.timesCopy.indexOf(value);
    let startDate = this.dateForm.value.startDate;
    startDate = new Date(startDate);
    this.endTimeOptions = [];

    const fourHoursLaterIndex = startTimeIndex + 8;
    if (this.isToday()) {
      if (fourHoursLaterIndex > this.totalTimes) {
        let currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 1);
        this.minDate = currentDate;
        let tamanio = fourHoursLaterIndex - this.totalTimes;
        this.endTimeOptions = [];
        for (tamanio; tamanio < this.totalTimes; tamanio++) {
          this.endTimeOptions.push(this.timesCopy[tamanio]);
        }
      } else {
        this.endTimeOptions = [];
        let tamanio = startTimeIndex + 8;
        for (tamanio; tamanio < this.totalTimes; tamanio++) {
          this.endTimeOptions.push(this.timesCopy[tamanio]);
        }
      }
    } else if (this.isTomorrow(startDate)) {
      let startDate = this.dateForm.value.startDate;
      if (fourHoursLaterIndex > this.totalTimes) {
        let currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + 1);
        this.minDate = currentDate;
        let tamanio = fourHoursLaterIndex - this.totalTimes;
        this.endTimeOptions = [];
        for (tamanio; tamanio < this.totalTimes; tamanio++) {
          this.endTimeOptions.push(this.timesCopy[tamanio]);
        }
      } else {
        this.endTimeOptions = [];
        let tamanio = startTimeIndex + 8;
        for (tamanio; tamanio < this.totalTimes; tamanio++) {
          this.endTimeOptions.push(this.timesCopy[tamanio]);
        }
      }
    } else {
      if (startTimeIndex >= 39) {
        let currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + 1);
        this.minDate = currentDate;
      }

      this.endTimeOptions = [];
      let tamanio = 0;
      for (tamanio; tamanio < this.totalTimes; tamanio++) {
        this.endTimeOptions.push(this.timesCopy[tamanio]);
      }
    }
  }

  isToday(): boolean {
    const today = new Date();
    const selectedDate = new Date(this.dateForm.get('startDate')?.value);

    // Establecer la hora al inicio del día para ambas fechas
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    return today.getTime() === selectedDate.getTime();
  }

  ngSubmit() {
    console.log(this.dateForm.value);
  }
}
