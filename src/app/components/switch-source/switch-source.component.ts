import { Component } from '@angular/core';
import { DataSource } from '../../enums/data-source.enum';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ConfigService } from '../../services/config.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'switch-source',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './switch-source.component.html',
  styleUrl: './switch-source.component.css',
})
export class SwitchSourceComponent {
  constructor(private configService: ConfigService) {}

  sources: DataSource[] = Object.values(DataSource);
  selected: FormControl<DataSource | null> = new FormControl<DataSource | null>(
    DataSource.JSON_SERVER
  );

  ngOnInit() {
    this.selected.setValue(this.configService.source);
  }

  onChange() {
    this.configService.source = this.selected.value as DataSource;
  }
}
