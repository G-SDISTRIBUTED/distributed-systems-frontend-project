<?php

namespace App\DataTables;

use App\Models\Cliente;
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

class ClientesDataTable extends DataTable
{
    /**
     * Build DataTable class.
     *
     * @param QueryBuilder $query Results from query() method.
     * @return \Yajra\DataTables\EloquentDataTable
     */
    public function dataTable(QueryBuilder $query): CollectionDataTable
    {
        $response = Http::get('http://127.0.0.1:8000/api/clientes');
        $jsonResponse = $response->json();
        $clientes = isset($jsonResponse['data']) ? $jsonResponse['data'] : [];

     Log::info("Clientes: ".json_encode($clientes));
        $dataTable = new CollectionDataTable(collect($clientes));

        $dataTable->addColumn('actions', function ($user) {
                    return $this->getActions(1, 'device/', 'device.', 'enable', 'devices')
                    . ' ' . $this->getActionDelete(1, 'device.','enable');
            });
            $dataTable->rawColumns(['actions']);

        return $dataTable;
    }

    /**
     * Get query source of dataTable.
     *
     * @param \App\Models\Cliente $model
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function query(Cliente $model): QueryBuilder
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
                    ->setTableId('clientes-table')
                    ->columns($this->getColumns())
                    ->minifiedAjax()
                    //->dom('Bfrtip')
                    ->orderBy(1)
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
            Column::make('ci'),
            Column::make('nombre'),
            Column::make('direccion'),
            Column::make('telefono'),
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
        return 'Clientes_' . date('YmdHis');
    }

    protected function getActions($id, $url,$route,$state,$model)
    {


        $show=$model.'.read';
        $update=$model.'.update';
        $disable=$model.'.disable';



        $icon="fa fa-thumbs-down";
        $msg=__('messages.state.confirmation');


        if($state!="messages.state.enable"){
            $icon="fa fa-thumbs-up";
            $msg=__('messages.state.confirmation.up');
        }

        $actionShow='<a href="' . $url . $id . '" class="btn btn-xs btn-info" data-toggle="tooltip" 
                title="' . __('messages.general.show') . '"><i class="fa fa-eye"></i></a> ';

        $actionEdit='<a href="' . $url . $id . '/edit" class="btn btn-xs btn-warning" data-toggle="tooltip" 
                 title="' . __('messages.general.edit') . '"><i class="fa fa-pencil-square-o"></i></a>';

        $actionState='<a onclick="validateChangeState(\'change-state-form-' . $id . '\',\'' . $msg . '\')" 
                    class="btn btn-xs btn-success" data-toggle="tooltip" title="' . __('messages.general.change.state') . '">
                    <i class="'.$icon.'"></i>
                </a>
              
                <form id="change-state-form-' . $id . '" action="' . "". '" method="POST" style="display: none">
                    <input type="hidden" name="_method" value="DELETE">
                    <input type="hidden" name="_token" value="' . csrf_token() . '" />
                </form>';



        if($state=="messages.state.block"){

            $icon="fa fa-thumbs-down";
            $msg=__('messages.state.confirmation');

            $actionShow='<a href="' . $url . $id . '" class="btn btn-xs btn-info" data-toggle="tooltip" 
                title="' . __('messages.general.show') . '"><i class="fa fa-eye"></i></a> ';

            $actionEdit='<a href="' . $url . $id . '/edit" class="btn btn-xs btn-warning" data-toggle="tooltip" 
                 title="' . __('messages.general.edit') . '"><i class="fa fa-pencil-square-o"></i></a>';

            $actionState='<a onclick="validateChangeState(\'change-state-form-' . $id . '\',\'' . $msg . '\')" 
                    class="btn btn-xs btn-success" data-toggle="tooltip" title="' . __('messages.general.change.state') . '">
                    <i class="'.$icon.'"></i>
                </a>
              
                <form id="change-state-form-' . $id . '" action="' . '' . '" method="POST" style="display: none">
                    <input type="hidden" name="_method" value="DELETE">
                    <input type="hidden" name="_token" value="' . csrf_token() . '" />
                </form>';
        }


        return $actionShow." ".$actionEdit." ".$actionState;
    }

    public function getActionDelete($id, $route,$state)
    {
        $actionDelete='<a onclick="validateDeleteAction(\'delete-form-' . $id . '\')"
                    class="btn btn-xs btn-danger" data-toggle="tooltip" title="' . __('messages.general.delete') . '">
                    <i class="fa fa-trash"></i>
                </a>
                
                
                <form id="delete-form-' . $id . '" action="' . '' . '" method="POST" style="display: none">
                    <input type="hidden" name="_method" value="POST">
                    <input type="hidden" name="_token" value="' . csrf_token() . '" />
                </form>';


        

        return $actionDelete;
    }
}
