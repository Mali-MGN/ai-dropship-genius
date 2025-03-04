
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Trash2, 
  Save, 
  X, 
  Edit, 
  Copy, 
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ColumnType = 'text' | 'number' | 'select' | 'checkbox' | 'date';

export interface TableColumn {
  id: string;
  header: string;
  accessorKey: string;
  type?: ColumnType;
  options?: string[] | { value: string; label: string }[];
  editable?: boolean;
  width?: string;
  sortable?: boolean;
  filterable?: boolean;
  renderCell?: (value: any, row: any) => React.ReactNode;
}

export interface TableEditorProps {
  columns: TableColumn[];
  data: any[];
  onDataChange?: (newData: any[]) => void;
  onRowAdd?: (newRow: any) => void;
  onRowDelete?: (rowId: string | number) => void;
  onRowUpdate?: (updatedRow: any) => void;
  primaryKey?: string;
  className?: string;
  showToolbar?: boolean;
  canAdd?: boolean;
  canDelete?: boolean;
  canEdit?: boolean;
  canSort?: boolean;
  canFilter?: boolean;
  pageSize?: number;
  loading?: boolean;
}

export function TableEditor({
  columns,
  data,
  onDataChange,
  onRowAdd,
  onRowDelete,
  onRowUpdate,
  primaryKey = "id",
  className,
  showToolbar = true,
  canAdd = true,
  canDelete = true,
  canEdit = true,
  canSort = true,
  canFilter = false,
  pageSize = 10,
  loading = false,
}: TableEditorProps) {
  const [tableData, setTableData] = useState<any[]>(data);
  const [editingRow, setEditingRow] = useState<string | number | null>(null);
  const [editedValues, setEditedValues] = useState<Record<string, any>>({});
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [showFilterRow, setShowFilterRow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const handleEdit = (rowId: string | number) => {
    const rowToEdit = tableData.find(row => row[primaryKey] === rowId);
    setEditingRow(rowId);
    setEditedValues(rowToEdit || {});
  };

  const handleCancelEdit = () => {
    setEditingRow(null);
    setEditedValues({});
  };

  const handleSaveEdit = (rowId: string | number) => {
    const updatedData = tableData.map(row => {
      if (row[primaryKey] === rowId) {
        const updatedRow = { ...row, ...editedValues };
        if (onRowUpdate) {
          onRowUpdate(updatedRow);
        }
        return updatedRow;
      }
      return row;
    });
    
    setTableData(updatedData);
    setEditingRow(null);
    setEditedValues({});
    
    if (onDataChange) {
      onDataChange(updatedData);
    }
  };

  const handleAddRow = () => {
    const newRow = { [primaryKey]: Date.now() };
    columns.forEach(column => {
      if (column.accessorKey !== primaryKey) {
        newRow[column.accessorKey] = '';
      }
    });
    
    const updatedData = [...tableData, newRow];
    setTableData(updatedData);
    setEditingRow(newRow[primaryKey]);
    setEditedValues(newRow);
    
    if (onRowAdd) {
      onRowAdd(newRow);
    }
    
    if (onDataChange) {
      onDataChange(updatedData);
    }
  };

  const handleDeleteRow = (rowId: string | number) => {
    const updatedData = tableData.filter(row => row[primaryKey] !== rowId);
    setTableData(updatedData);
    
    if (onRowDelete) {
      onRowDelete(rowId);
    }
    
    if (onDataChange) {
      onDataChange(updatedData);
    }
  };

  const handleDuplicateRow = (rowId: string | number) => {
    const rowToDuplicate = tableData.find(row => row[primaryKey] === rowId);
    if (rowToDuplicate) {
      const newRow = {
        ...rowToDuplicate,
        [primaryKey]: Date.now()
      };
      
      const updatedData = [...tableData, newRow];
      setTableData(updatedData);
      
      if (onRowAdd) {
        onRowAdd(newRow);
      }
      
      if (onDataChange) {
        onDataChange(updatedData);
      }
    }
  };

  const handleSortClick = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.key === key) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    }
    
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (columnId: string, value: any) => {
    const newFilters = { ...filters };
    if (value === "" || value === undefined || value === null) {
      delete newFilters[columnId];
    } else {
      newFilters[columnId] = value;
    }
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleInputChange = (columnId: string, value: any) => {
    setEditedValues(prev => ({
      ...prev,
      [columnId]: value
    }));
  };

  const getSortedAndFilteredData = () => {
    let result = [...tableData];
    
    // Apply filters
    if (Object.keys(filters).length > 0) {
      result = result.filter(row => {
        return Object.entries(filters).every(([key, filterValue]) => {
          const cellValue = String(row[key]).toLowerCase();
          return cellValue.includes(String(filterValue).toLowerCase());
        });
      });
    }
    
    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return result;
  };

  const getPaginatedData = () => {
    const sorted = getSortedAndFilteredData();
    const startIndex = (currentPage - 1) * pageSize;
    return sorted.slice(startIndex, startIndex + pageSize);
  };

  const totalPages = Math.ceil(getSortedAndFilteredData().length / pageSize);

  const renderCellContent = (row: any, column: TableColumn) => {
    const value = row[column.accessorKey];
    
    if (column.renderCell) {
      return column.renderCell(value, row);
    }
    
    return value;
  };

  const renderEditableCell = (column: TableColumn) => {
    const value = editedValues[column.accessorKey];
    
    switch (column.type) {
      case 'checkbox':
        return (
          <Checkbox
            checked={!!value}
            onCheckedChange={(checked) => handleInputChange(column.accessorKey, checked)}
          />
        );
      
      case 'select':
        return (
          <Select
            value={value || ''}
            onValueChange={(val) => handleInputChange(column.accessorKey, val)}
          >
            <SelectTrigger className="w-full h-8">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {column.options?.map((option: any) => (
                <SelectItem 
                  key={typeof option === 'string' ? option : option.value} 
                  value={typeof option === 'string' ? option : option.value}
                >
                  {typeof option === 'string' ? option : option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'number':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => handleInputChange(column.accessorKey, e.target.value)}
            className="h-8"
          />
        );
      
      case 'date':
        return (
          <Input
            type="date"
            value={value || ''}
            onChange={(e) => handleInputChange(column.accessorKey, e.target.value)}
            className="h-8"
          />
        );
      
      default:
        return (
          <Input
            type="text"
            value={value || ''}
            onChange={(e) => handleInputChange(column.accessorKey, e.target.value)}
            className="h-8"
          />
        );
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {showToolbar && (
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            {canFilter && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilterRow(!showFilterRow)}
                className="flex items-center gap-1"
              >
                <Filter className="h-4 w-4" />
                {showFilterRow ? "Hide Filters" : "Show Filters"}
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {canAdd && (
              <Button 
                size="sm" 
                onClick={handleAddRow}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Row
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead 
                    key={column.id} 
                    style={{ width: column.width }}
                    className={cn(
                      column.sortable && canSort ? "cursor-pointer select-none" : "",
                      "px-2 py-3 bg-muted/50"
                    )}
                    onClick={() => {
                      if (column.sortable && canSort) {
                        handleSortClick(column.accessorKey);
                      }
                    }}
                  >
                    <div className="flex items-center gap-1 font-medium">
                      {column.header}
                      {column.sortable && canSort && sortConfig?.key === column.accessorKey && (
                        sortConfig.direction === 'asc' 
                          ? <ChevronUp className="h-4 w-4" /> 
                          : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                ))}
                {(canEdit || canDelete) && (
                  <TableHead className="w-[120px] bg-muted/50 px-2 py-3">Actions</TableHead>
                )}
              </TableRow>
              
              {showFilterRow && (
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={`filter-${column.id}`} className="px-2 py-1 bg-muted/20">
                      {column.filterable !== false && (
                        <Input
                          placeholder={`Filter ${column.header}...`}
                          value={filters[column.accessorKey] || ''}
                          onChange={(e) => handleFilterChange(column.accessorKey, e.target.value)}
                          className="h-8"
                        />
                      )}
                    </TableCell>
                  ))}
                  {(canEdit || canDelete) && <TableCell className="bg-muted/20" />}
                </TableRow>
              )}
            </TableHeader>
            
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length + (canEdit || canDelete ? 1 : 0)} className="h-24 text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : getPaginatedData().length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + (canEdit || canDelete ? 1 : 0)} className="h-24 text-center">
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                getPaginatedData().map((row) => (
                  <TableRow key={row[primaryKey]}>
                    {columns.map((column) => (
                      <TableCell key={`${row[primaryKey]}-${column.id}`} className="px-2 py-2">
                        {editingRow === row[primaryKey] && column.editable !== false ? (
                          renderEditableCell(column)
                        ) : (
                          <div className="min-h-[28px] flex items-center">
                            {renderCellContent(row, column)}
                          </div>
                        )}
                      </TableCell>
                    ))}
                    
                    {(canEdit || canDelete) && (
                      <TableCell className="px-2 py-2">
                        <div className="flex items-center gap-1">
                          {editingRow === row[primaryKey] ? (
                            <>
                              <Button variant="ghost" size="sm" onClick={() => handleSaveEdit(row[primaryKey])}>
                                <Save className="h-4 w-4 text-green-500" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                                <X className="h-4 w-4 text-red-500" />
                              </Button>
                            </>
                          ) : (
                            <>
                              {canEdit && (
                                <Button variant="ghost" size="sm" onClick={() => handleEdit(row[primaryKey])}>
                                  <Edit className="h-4 w-4 text-blue-500" />
                                </Button>
                              )}
                              <Button variant="ghost" size="sm" onClick={() => handleDuplicateRow(row[primaryKey])}>
                                <Copy className="h-4 w-4 text-blue-500" />
                              </Button>
                              {canDelete && (
                                <Button variant="ghost" size="sm" onClick={() => handleDeleteRow(row[primaryKey])}>
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, getSortedAndFilteredData().length)} of {getSortedAndFilteredData().length} entries
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1 mx-2">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum = i + 1;
                if (totalPages > 5 && currentPage > 3) {
                  pageNum = currentPage + i - 2;
                  if (pageNum > totalPages) {
                    pageNum = totalPages - (4 - i);
                  }
                }
                return (
                  <Button 
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
