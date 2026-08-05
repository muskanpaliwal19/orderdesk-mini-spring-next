package com.example.orders.service;

import com.example.orders.dto.OrderDto;
import com.example.orders.dto.OrderMapper;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.Writer;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CsvExportService {

    private final OrderService orderService;
    private final OrderMapper orderMapper;

    public CsvExportService(OrderService orderService, OrderMapper orderMapper) {
        this.orderService = orderService;
        this.orderMapper = orderMapper;
    }

    public void writeOrdersToCsv(Writer writer) throws IOException {
        List<OrderDto> orders = orderService.getAllOrders(Sort.by(Sort.Direction.ASC, "id")).stream()
                .map(orderMapper::toDto)
                .collect(Collectors.toList());

        CSVFormat csvFormat = CSVFormat.DEFAULT.builder()
                .setHeader("id", "customer_name", "customer_email", "item_description", "quantity", "unit_price_cents", "status", "created_at", "updated_at", "notes")
                .build();

        try (final CSVPrinter printer = new CSVPrinter(writer, csvFormat)) {
            for (OrderDto order : orders) {
                printer.printRecord(
                        order.id(),
                        order.customerName(),
                        order.customerEmail(),
                        order.itemDescription(),
                        order.quantity(),
                        order.unitPriceCents(),
                        order.status(),
                        order.createdAt(),
                        order.updatedAt(),
                        order.notes()
                );
            }
        }
    }
}
