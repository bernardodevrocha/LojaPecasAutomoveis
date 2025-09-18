<template>
  <div class="page">
    <AppHeader />

    <div class="container">
      <h2 class="title">Dashboard</h2>

      <!-- KPIs -->
      <section class="kpis">
        <div class="kpi">
          <div class="kpi-label">Vendas hoje</div>
          <div class="kpi-value">{{ toBRL(kpis.hoje) }}</div>
        </div>
        <div class="kpi">
          <div class="kpi-label">Vendas no mês</div>
          <div class="kpi-value">{{ toBRL(kpis.mes) }}</div>
        </div>
        <div class="kpi">
          <div class="kpi-label">Ticket médio</div>
          <div class="kpi-value">{{ toBRL(kpis.ticket) }}</div>
        </div>
      </section>

      <section class="charts">
        <div class="card">
          <h3 class="card-title">Vendas (últimos 7 dias)</h3>
          <div class="chart-wrap">
            <canvas id="salesLine"></canvas>
          </div>
        </div>

        <div class="card">
          <h3 class="card-title">Top categorias (R$)</h3>
          <div class="chart-wrap">
            <canvas id="catBar"></canvas>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import AppHeader from '@/components/AppHeader.vue'
import axios from 'axios'
import { onMounted, ref } from 'vue'

// Chart.js
import {
  Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale,
  BarController, BarElement, Tooltip, Legend
} from 'chart.js'
Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale,
               BarController, BarElement, Tooltip, Legend)

const kpis   = ref({ hoje: 0, mes: 0, ticket: 0 })
const byDay  = ref([]) // [{date:'dd/MM', total:1234}]
const topCat = ref([]) // [{category:'Freios', total:1234}]

function toBRL(v){ return (Number(v)||0).toLocaleString('pt-BR', { style:'currency', currency:'BRL' }) }

async function load() {
  try {
    // Ajuste as URLs quando criá-las no backend
    const [{data: sum}, {data: daily}, {data: cats}] = await Promise.all([
      axios.get('http://localhost:3000/api/sales/summary'),
      axios.get('http://localhost:3000/api/sales/by-day?days=7'),
      axios.get('http://localhost:3000/api/sales/top-categories?limit=5')
,
    ])
    kpis.value   = sum
    byDay.value  = daily
    topCat.value = cats
  } catch {
    // MOCK amigável enquanto a API não existe
    const today = new Date()
    byDay.value = Array.from({length:7}).map((_,i)=>{
      const d=new Date(today); d.setDate(d.getDate()-(6-i))
      return { date: d.toLocaleDateString('pt-BR').slice(0,5), total: Math.round(500+Math.random()*3500) }
    })
    topCat.value = [
      { category:'Freios',     total: 5234 },
      { category:'Motor',      total: 4212 },
      { category:'Elétrica',   total: 3120 },
      { category:'Suspensão',  total: 2088 },
      { category:'Rodas',      total: 1540 },
    ]
    kpis.value = { hoje: 1240, mes: 23890, ticket: 129.5 }
  } finally {
    drawCharts()
  }
}

function drawCharts(){
  // Line
  const lineEl = document.getElementById('salesLine')
  if (lineEl._chart) lineEl._chart.destroy()
  lineEl._chart = new Chart(lineEl, {
    type: 'line',
    data: {
      labels: byDay.value.map(d=>d.date),
      datasets: [{ label:'Vendas (R$)', data: byDay.value.map(d=>d.total), tension:.3 }]
    },
    options: { responsive:true, maintainAspectRatio:false }
  })

  // Bar
  const barEl = document.getElementById('catBar')
  if (barEl._chart) barEl._chart.destroy()
  barEl._chart = new Chart(barEl, {
    type: 'bar',
    data: {
      labels: topCat.value.map(d=>d.category),
      datasets: [{ label:'Total (R$)', data: topCat.value.map(d=>d.total) }]
    },
    options: { responsive:true, maintainAspectRatio:false }
  })
}

onMounted(load)
</script>

<style scoped>
.page{ background:#f5f6f8; min-height:100vh; }
.container{ max-width:1200px; margin:0 auto; padding:16px; }
.title{ margin:16px 0; }

.kpis{ display:grid; gap:12px; grid-template-columns: repeat(3, minmax(0,1fr)); }
.kpi{ background:#fff; border:1px solid #e5e7eb; border-radius:10px; padding:16px; }
.kpi-label{ color:#6b7280; font-size:14px; }
.kpi-value{ font-size:22px; font-weight:700; }

.charts{ display:grid; gap:16px; grid-template-columns: repeat(2, minmax(0,1fr)); margin-top:16px; }
.card{ background:#fff; border:1px solid #e5e7eb; border-radius:10px; padding:12px; }
.card-title{ margin:6px 0 12px; }
.chart-wrap{ position:relative; height:300px; }

@media (max-width: 900px){
  .kpis{ grid-template-columns: 1fr; }
  .charts{ grid-template-columns: 1fr; }
}
</style>
