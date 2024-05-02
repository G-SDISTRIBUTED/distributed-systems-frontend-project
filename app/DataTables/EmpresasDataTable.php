<?php

namespace App\DataTables;

use App\Models\Empresa;
use Illuminate\Database\Eloquent\Builder as QueryBuilder;
use Yajra\DataTables\EloquentDataTable;
use Yajra\DataTables\Html\Builder as HtmlBuilder;
use Yajra\DataTables\Html\Button;
use Yajra\DataTables\Html\Column;
use Yajra\DataTables\Html\Editor\Editor;
use Yajra\DataTables\Html\Editor\Fields;
use Yajra\DataTables\Services\DataTable;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use PgSql\Lob;
use Yajra\DataTables\CollectionDataTable;

class EmpresasDataTable extends DataTable
{
    /**
     * Build DataTable class.
     *
     * @param QueryBuilder $query Results from query() method.
     * @return \Yajra\DataTables\EloquentDataTable
     */
    public function dataTable(QueryBuilder $query): CollectionDataTable
    {
        $response = Http::get('http://127.0.0.1:8000/api/empresas', [
            'perPages' => 4,
            'pages' => 1,
        ]);
        $jsonResponse = $response->json();
        $empresas = isset($jsonResponse['data']) ? $jsonResponse['data'] : [];

        $dataTable = new CollectionDataTable(collect($empresas));

        $dataTable->addColumn('actions', function ($empresa) {
                    return $this->getActions($empresa['id'], 'empresa/', '', 'enable', '')
                    . ' ' . $this->getActionDelete($empresa['id'], 'empresa.','enable');
            });
            $dataTable->rawColumns(['actions']);

        return $dataTable;
    }

    /**
     * Get query source of dataTable.
     *
     * @param \App\Models\Empresa $model
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function query(Empresa $model): QueryBuilder
    {
        return $model->newQuery();
    }

    /**
     * Optional method if you want to use html builder.
     *
     * @return \Yajra\DataTables\Html\Builder
     */
    public function html(): HtmlBuilder
    {
        return $this->builder()
                    ->setTableId('empresas-table')
                    ->columns($this->getColumns())
                    ->minifiedAjax()
                    //->dom('Bfrtip')
                    ->orderBy(1)
                    ->lengthMenu([5,10, 15, 20])
                    ->selectStyleSingle()
                    ->buttons([
                        Button::make('excel'),
                        Button::make('csv'),
                        Button::make('pdf'),
                        Button::make('print'),
                        Button::make('reset'),
                        Button::make('reload')
                    ]);
    }

    /**
     * Get the dataTable columns definition.
     *
     * @return array
     */
    public function getColumns(): array
    {
        return [
            Column::make('id'),
            Column::make('nombre'),
            Column::make('telefono'),
            Column::make('direccion'),
            Column::make('saldo'),
            Column::make('id_clase'),
            Column::computed('actions'),
        ];
    }

    /**
     * Get filename for export.
     *
     * @return string
     */
    protected function filename(): string
    {
        return 'Empresas_' . date('YmdHis');
    }

    protected function getActions($id, $url,$route,$state,$model)
    {
        $actionShow='<a href="' . $url . 'show/'. $id . '" class="btn btn-xs btn-info" data-toggle="tooltip" 
                title="' . __('messages.general.show') . '"><i class="fa fa-eye"></i></a> ';

        $actionEdit='<a href="' . $url . 'edit/'.$id. '" class="btn btn-xs btn-warning" data-toggle="tooltip" 
                 title="' . __('messages.general.edit') . '"><i class="fa fa-pencil-square-o"></i></a>';

        return $actionShow." ".$actionEdit;
    }

    public function getActionDelete($id, $route,$state)
    {
        $actionDelete='<a onclick="validateDeleteAction(\'delete-form-' . $id . '\')"
                    class="btn btn-xs btn-danger" data-toggle="tooltip" title="' . __('messages.general.delete') . '">
                    <i class="fa fa-trash"></i>
                </a>
                
                <form id="delete-form-' . $id . '" action="' . route($route . 'delete', $id) . '" method="POST" style="display: none">
                    <input type="hidden" name="_method" value="POST">
                    <input type="hidden" name="_token" value="' . csrf_token() . '" />
                </form>';
        return $actionDelete;
    }
}
